import os
import uuid
from math import ceil

from flask import (
    Blueprint, flash, redirect, render_template, request, url_for, jsonify
)
from flask_login import login_required, current_user
from sqlalchemy import exc
from werkzeug.exceptions import abort
from werkzeug.utils import secure_filename

from blog import db
from blog.models import Post, PostImage, User, PostLike, PostComment
from personal.auth import session_maker

blog_bp = Blueprint('blog', __name__)

UPLOAD_FOLDER = '/var/www/html/Development/Personal/blog/static/uploads'
ALLOWED_EXTENSIONS = {'txt', 'pdf', 'png', 'jpg', 'jpeg', 'gif'}


@blog_bp.route('/blog')
@login_required
def index():
    args = request.args
    limit = args.get("limit", default=5, type=int)
    page = args.get("page", default=1, type=int)
    start = (page - 1) * limit
    end = page * limit

    query = Post.query
    list = query.all()[start:end]
    count = query.count()
    route = url_for('blog.index') + "?page="

    data = {
        "start": start + 1,
        "end": end if end < count else count,
        "limit": limit,
        "count": count,
        "page": page,
        "route": route,
        "page_count": ceil(count / limit)
    }

    return render_template('blog/index.jinja2', posts=list, data=data)


@blog_bp.route('/blog/self/<string:user_uuid>')
@login_required
def blog_self(user_uuid):
    user = get_user_by_uuid(user_uuid)
    is_own = user.id == current_user.id

    args = request.args
    limit = args.get("limit", default=5, type=int)
    page = args.get("page", default=1, type=int)
    start = (page - 1) * limit
    end = page * limit

    query = Post.query.filter_by(user_id=user.id)
    list = query.all()[start:end]
    count = query.count()
    route = url_for('blog.blog_self', user_uuid=user.uuid) + "?page="

    data = {
        "start": start + 1,
        "end": end if end < count else count,
        "limit": limit,
        "count": count,
        "page": page,
        "route": route,
        "page_count": ceil(count / limit)
    }

    return render_template('blog/self.jinja2', posts=list, data=data, user=user, is_own=is_own)


@blog_bp.route('/blog/create', methods=('GET', 'POST'))
@login_required
def create():
    if request.method == 'POST':
        title = request.form['title']
        body = request.form['body']
        error = None

        if not title:
            error = 'Title is required.'

        if error is not None:
            flash(error)
        else:
            post = Post(
                title=title, body=body, user_id=current_user.id
            )
            db.session.add(post)
            db.session.commit()
            post_id = post.id

            if 'file' in request.files:
                file = request.files['file']
                if file and file.filename != '':
                    if not allowed_file(file.filename):
                        flash('File must be JPG')
                        db.session.rollback()
                        return redirect(request.url)
                    filename = file_name(file.filename)
                    file.save(os.path.join(UPLOAD_FOLDER, filename))

                    postImage = PostImage(
                        post_id=post_id, name=filename
                    )
                    db.session.add(postImage)

            db.session.commit()

            return redirect(url_for('blog.index'))

    return render_template('blog/create.jinja2')


@blog_bp.route('/<int:id>/update', methods=('GET', 'POST'))
@login_required
def update(id):
    post = get_post(id)

    if request.method == 'POST':
        title = request.form['title']
        body = request.form['body']
        error = None

        if not title:
            error = 'Title is required.'

        if error is not None:
            flash(error)
        else:
            post.title = title
            post.body = body
            db.session.commit()

            if 'file' in request.files:
                file = request.files['file']
                if file and file.filename != '':
                    if not allowed_file(file.filename):
                        flash('File must be JPG')
                        db.session.rollback()
                        return redirect(request.url)
                    filename = file_name(file.filename)
                    file.save(os.path.join(UPLOAD_FOLDER, filename))

                    postImage = PostImage(
                        post_id=id, name=filename
                    )
                    db.session.add(postImage)

            db.session.commit()

            return redirect(url_for('blog.update', id=id))

    post_images = get_post_images(id)

    return render_template('blog/update.jinja2', post=post, images=post_images)


@blog_bp.route('/blog/<int:post_id>/make_public', methods=('GET', 'POST'))
@login_required
def make_public(post_id):
    post = get_post(post_id)
    is_public = 1

    if post.is_public:
        is_public = 0

    if request.method == 'POST':
        post.is_public = is_public
        db.session.commit()

    return jsonify("success")


@blog_bp.route('/<int:post_id>/post_like')
@login_required
def post_like(post_id):
    like = get_post_like(post_id, current_user.id)
    get_post(post_id, False)

    if like is None:
        post_like = PostLike(
            user_id=current_user.id, post_id=post_id
        )
        db.session.add(post_like)
    else:
        PostLike.query.filter_by(post_id=post_id).filter_by(user_id=current_user.id).delete()

    db.session.commit()

    return redirect(url_for('blog.details', id=post_id))


@blog_bp.route('/<int:id>/details')
@login_required
def details(id):
    post = get_post(id, False)
    like = get_post_like(id, current_user.id)
    like_total = get_post_like_total(id)
    post_comments = get_post_comments(id)
    post_images = get_post_images(id)

    return render_template('blog/details.jinja2', post=post, like=like, like_total=like_total,
                           post_comments=post_comments, images=post_images)


@blog_bp.route('/blog/<int:post_id>/delete', methods=('GET', 'POST'))
@login_required
def delete(post_id):
    with session_maker() as db_session:
        post = get_post(post_id)
        success = True
        try:
            db_session.query(Post).filter_by(id=post_id).delete()
            db_session.commit()
        except exc.IntegrityError as e:
            errorInfo = e.orig.args
            print(errorInfo[0])  # This will give you error code
            print(errorInfo[1])  # This will give you error message
            error = f"Something went wrong!"
            success = False

        if success:
            return jsonify({"success": True, "route": url_for('blog.index')})
        else:
            return jsonify({"success": False, "error": error})


@blog_bp.route('/<int:post_id>/<int:image_id>/image_delete', methods=('POST',))
@login_required
def image_delete(post_id, image_id):
    with session_maker() as db_session:
        get_post(post_id)
        image = get_post_image(post_id, image_id)

        os.remove(os.path.join(UPLOAD_FOLDER, image.name))
        db_session.query(PostImage).filter_by(id=image_id).delete()
        db_session.commit()

        return redirect(url_for('blog.update', id=post_id))


@blog_bp.route('/<int:post_id>/post_comment', methods=('GET', 'POST'))
@login_required
def post_comment(post_id):
    if request.method == 'POST':
        user_id = current_user.id
        post_id = post_id
        body = request.form['body']
        error = None

        if not body:
            error = 'Body is required.'

        if error is not None:
            flash(error)
        else:
            postComment = PostComment(
                user_id=user_id, post_id=post_id, body=body
            )
            db.session.add(postComment)
            db.session.commit()

    return redirect(url_for('blog.details', id=post_id))


@blog_bp.route('/<int:post_id>/<int:comment_id>/comment_delete', methods=('POST',))
@login_required
def comment_delete(post_id, comment_id):
    get_post(post_id)
    get_post_comment(comment_id, post_id, current_user.id)

    PostComment.query.filter_by(id=comment_id).delete()
    db.session.commit()

    return redirect(url_for('blog.details', id=post_id))


def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


def get_post(id, check_author=True):
    post = Post.query.get(id)

    if post is None:
        abort(404, f"Post id {id} doesn't exist.")

    if check_author and post.user_id != current_user.id:
        abort(403)

    return post


def get_post_comment(comment_id, post_id, user_id, check_author=True):
    post_comment = PostComment.query.get(comment_id)

    if post_comment is None:
        abort(404, f"Post Comment id {id} doesn't exist.")

    if check_author and post_comment.user_id != current_user.id:
        abort(403)

    return post_comment


def get_user_by_uuid(uuid):
    user = User.query.filter_by(uuid=uuid).first()
    if user is None:
        abort(404, f"User {uuid} doesn't exist.")

    return user


def get_post_image(post_id, image_id):
    post_image = PostImage.query.filter_by(id=image_id).filter_by(post_id=post_id).first()

    if post_image is None:
        abort(404, f"Post Image id {id} doesn't exist.")

    return post_image


def get_post_like(post_id, user_id):
    like = PostLike.query.filter_by(post_id=post_id).filter_by(user_id=user_id).first()

    if like is None:
        return None

    return like


def get_post_like_total(post_id):
    return PostLike.query.filter_by(post_id=post_id).count()


def get_post_comments(post_id):
    return PostComment.query.filter_by(post_id=post_id).all()


def file_name(filename):
    filename = secure_filename(filename)

    extension = filename.rsplit('.', 1)[1].lower()
    return str(uuid.uuid4()) + '.' + extension


def get_post_images(post_id):
    return PostImage.query.filter_by(post_id=post_id).all()
