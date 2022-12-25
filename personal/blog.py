import os
import uuid
from math import ceil

from flask import (
    Blueprint, flash, g, redirect, render_template, request, url_for, jsonify
)
from sqlalchemy import exc
from werkzeug.exceptions import abort
from werkzeug.utils import secure_filename

from models import Post, PostImage, PostLike, PostComment, UserModel
from personal.auth import login_required, session_maker

bp = Blueprint('blog', __name__)

UPLOAD_FOLDER = '/var/www/html/Development/Personal/personal/static/uploads'
ALLOWED_EXTENSIONS = {'txt', 'pdf', 'png', 'jpg', 'jpeg', 'gif'}


@bp.route('/blog')
@login_required
def index():
    with session_maker() as db_session:
        args = request.args
        limit = args.get("limit", default=5, type=int)
        page = args.get("page", default=1, type=int)
        start = (page - 1) * limit
        end = page * limit

        query = db_session.query(Post)
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

    return render_template('blog/index.html', posts=list, data=data)


@bp.route('/blog/self/<string:user_uuid>')
@login_required
def blog_self(user_uuid):
    with session_maker() as db_session:
        user = get_user_by_uuid(user_uuid)
        is_own = user.id == g.user.id

        args = request.args
        limit = args.get("limit", default=5, type=int)
        page = args.get("page", default=1, type=int)
        start = (page - 1) * limit
        end = page * limit

        query = db_session.query(Post).filter_by(author_id=user.id)
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

        return render_template('blog/self.html', posts=list, data=data, user=user, is_own=is_own)


@bp.route('/blog/create', methods=('GET', 'POST'))
@login_required
def create():
    with session_maker() as db_session:
        if request.method == 'POST':
            title = request.form['title']
            body = request.form['body']
            post_uuid = str(uuid.uuid4())
            error = None

            if not title:
                error = 'Title is required.'

            if error is not None:
                flash(error)
            else:
                post = Post(
                    uuid=post_uuid, title=title, body=body, author_id=g.user.id
                )
                db_session.add(post)
                db_session.commit()
                post_id = post.id

                if 'file' in request.files:
                    file = request.files['file']
                    if file and file.filename != '':
                        if not allowed_file(file.filename):
                            flash('File must be JPG')
                            db_session.rollback()
                            return redirect(request.url)
                        filename = file_name(file.filename)
                        file.save(os.path.join(UPLOAD_FOLDER, filename))

                        postImage = PostImage(
                            post_id=post_id, name=filename
                        )
                        db_session.add(postImage)

                db_session.commit()

                return redirect(url_for('blog.index'))

        return render_template('blog/create.html')


def get_post(id, check_author=True):
    with session_maker() as db_session:
        post = db_session.query(Post).filter_by(id=id).first()

        if post is None:
            abort(404, f"Post id {id} doesn't exist.")

        if check_author and post.author_id != g.user.id:
            abort(403)

        return post


def get_post_comment(comment_id, post_id, user_id, check_author=True):
    with session_maker() as db_session:
        post_comment = db_session.query(PostComment).get(comment_id)

        if post_comment is None:
            abort(404, f"Post Comment id {id} doesn't exist.")

        if check_author and post_comment.user_id != g.user.id:
            abort(403)

        return post_comment


def get_user_by_uuid(uuid):
    with session_maker() as db_session:
        user = db_session.query(UserModel).filter_by(uuid=uuid).first()

        return user


def get_post_image(post_id, image_id):
    with session_maker() as db_session:
        post_image = db_session.query(PostImage).filter_by(id=image_id).filter_by(post_id=post_id).first()

        if post_image is None:
            abort(404, f"Post Image id {id} doesn't exist.")

        return post_image


def get_post_like(post_id, user_id):
    with session_maker() as db_session:
        like = db_session.query(PostLike).filter_by(post_id=post_id).filter_by(user_id=user_id).first()

        if like is None:
            return None

        return like


def get_post_like_total(post_id):
    with session_maker() as db_session:
        like_total = db_session.query(PostLike).filter_by(post_id=post_id).all()

        return len(like_total)


def get_post_comments(post_id):
    with session_maker() as db_session:
        post_comments = db_session.query(PostComment).filter_by(post_id=post_id).all()

        return post_comments


def get_post_images(post_id):
    with session_maker() as db_session:
        post_images = db_session.query(PostImage).filter_by(post_id=post_id).all()

        return post_images


@bp.route('/<int:id>/update', methods=('GET', 'POST'))
@login_required
def update(id):
    with session_maker() as db_session:
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
                post = db_session.query(Post).get(id)
                post.title = title
                post.body = body
                db_session.commit()

                if 'file' in request.files:
                    file = request.files['file']
                    if file and file.filename != '':
                        if not allowed_file(file.filename):
                            flash('File must be JPG')
                            db_session.rollback()
                            return redirect(request.url)
                        filename = file_name(file.filename)
                        file.save(os.path.join(UPLOAD_FOLDER, filename))

                        postImage = PostImage(
                            post_id=id, name=filename
                        )
                        db_session.add(postImage)

                db_session.commit()

                return redirect(url_for('blog.update', id=id))

        post_images = get_post_images(id)

        return render_template('blog/update.html', post=post, images=post_images)


def file_name(filename):
    filename = secure_filename(filename)

    extension = filename.rsplit('.', 1)[1].lower()
    return str(uuid.uuid4()) + '.' + extension


@bp.route('/blog/<int:post_id>/make_public', methods=('GET', 'POST'))
@login_required
def make_public(post_id):
    with session_maker() as db_session:
        post = get_post(post_id)
        is_public = 1

        if post.is_public:
            is_public = 0

        if request.method == 'POST':
            post = db_session.query(Post).get(post_id)
            post.is_public = is_public
            db_session.commit()

        return jsonify("success")


@bp.route('/<int:post_id>/post_like')
@login_required
def post_like(post_id):
    with session_maker() as db_session:
        like = get_post_like(post_id, g.user.id)
        post = get_post(post_id)
        user = g.user

        if like is None:
            user.postLikes.append(post)
            db_session.add(user)
        else:
            db_session.query(PostLike).filter_by(post_id=post_id).filter_by(user_id=g.user.id).delete()

        db_session.commit()

        return redirect(url_for('blog.details', id=post_id))


@bp.route('/<int:id>/details')
@login_required
def details(id):
    post = get_post(id, False)
    like = get_post_like(id, g.user.id)
    like_total = get_post_like_total(id)
    post_comments = get_post_comments(id)
    post_images = get_post_images(id)

    return render_template('blog/details.html', post=post, like=like, like_total=like_total,
                           post_comments=post_comments, images=post_images)


@bp.route('/blog/<int:post_id>/delete', methods=('GET', 'POST'))
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


@bp.route('/<int:post_id>/<int:image_id>/image_delete', methods=('POST',))
@login_required
def image_delete(post_id, image_id):
    with session_maker() as db_session:
        get_post(post_id)
        image = get_post_image(post_id, image_id)

        os.remove(os.path.join(UPLOAD_FOLDER, image.name))
        db_session.query(PostImage).filter_by(id=image_id).delete()
        db_session.commit()

        return redirect(url_for('blog.update', id=post_id))


@bp.route('/<int:post_id>/post_comment', methods=('GET', 'POST'))
@login_required
def post_comment(post_id):
    with session_maker() as db_session:
        if request.method == 'POST':
            user_id = g.user.id
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
                db_session.add(postComment)
                db_session.commit()

        return redirect(url_for('blog.details', id=post_id))


@bp.route('/<int:post_id>/<int:comment_id>/comment_delete', methods=('POST',))
@login_required
def comment_delete(post_id, comment_id):
    with session_maker() as db_session:
        get_post(post_id)
        get_post_comment(comment_id, post_id, g.user.id)

        db_session.query(PostComment).filter_by(id=comment_id).delete()
        db_session.commit()

        return redirect(url_for('blog.details', id=post_id))


def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS
