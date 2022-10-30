import os
import uuid

from flask import (
    Blueprint, flash, g, redirect, render_template, request, url_for, jsonify
)
from werkzeug.exceptions import abort
from werkzeug.utils import secure_filename

from personal.auth import login_required
from personal.db import get_db

bp = Blueprint('blog', __name__)

UPLOAD_FOLDER = '/var/www/Practice/Python/Flask/personal/personal/static/uploads'
ALLOWED_EXTENSIONS = {'txt', 'pdf', 'png', 'jpg', 'jpeg', 'gif'}


@bp.route('/blog')
@login_required
def index():
    db = get_db()
    posts = db.execute(
        'SELECT p.id, title, body, created, author_id, username'
        ' FROM post p JOIN user u ON p.author_id = u.id'
        ' WHERE p.is_public = 1'
        ' ORDER BY created DESC'
    ).fetchall()
    return render_template('blog/index.html', posts=posts)


@bp.route('/blog/self/<string:user_uuid>')
@login_required
def blog_self(user_uuid):
    user = get_user_by_uuid(user_uuid)
    is_own = user['id'] == g.user['id']

    db = get_db()
    posts = db.execute(
        'SELECT p.id, title, body, created, author_id, username'
        ' FROM post p JOIN user u ON p.author_id = u.id'
        ' WHERE u.uuid = ?',
        (str(user_uuid),)
    ).fetchall()
    return render_template('blog/self.html', posts=posts, user=user, is_own=is_own)


@bp.route('/blog/create', methods=('GET', 'POST'))
@login_required
def create():
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
            db = get_db()
            row = db.execute(
                'INSERT INTO post (uuid, title, body, author_id)'
                ' VALUES (?, ?, ?, ?)',
                (post_uuid, title, body, g.user['id'])
            )

            post_id = row.lastrowid

            if 'file' in request.files:
                file = request.files['file']
                if file and file.filename != '':
                    if not allowed_file(file.filename):
                        flash('File must be JPG')
                        db.rollback()
                        return redirect(request.url)
                    filename = secure_filename(file.filename)
                    file.save(os.path.join(UPLOAD_FOLDER, filename))

                    db = get_db()
                    db.execute(
                        'INSERT INTO post_image (post_id, name)'
                        ' VALUES (?, ?)',
                        (post_id, filename)
                    )
            db.commit()

            return redirect(url_for('blog.index'))

    return render_template('blog/create.html')


def get_post(id, check_author=True):
    post = get_db().execute(
        'SELECT p.id, title, body, is_public, created, author_id, username'
        ' FROM post p JOIN user u ON p.author_id = u.id'
        ' WHERE p.id = ?',
        (id,)
    ).fetchone()

    if post is None:
        abort(404, f"Post id {id} doesn't exist.")

    if check_author and post['author_id'] != g.user['id']:
        abort(403)

    return post


def get_post_comment(comment_id, post_id, user_id, check_author=True):
    post_comment = get_db().execute(
        'SELECT p.id, post_id, body, created, user_id, username'
        ' FROM post_comment p JOIN user u ON p.user_id = u.id'
        ' WHERE p.id = ? AND p.post_id = ? AND p.user_id = ?',
        (comment_id, post_id, user_id,)
    ).fetchone()

    if post_comment is None:
        abort(404, f"Post Comment id {id} doesn't exist.")

    if check_author and post_comment['user_id'] != g.user['id']:
        abort(403)

    return post_comment


def get_user_by_uuid(user_uuid):
    user = get_db().execute('SELECT * FROM user WHERE uuid = ?', (user_uuid,)).fetchone()

    return user


def get_post_image(post_id, image_id):
    post_image = get_db().execute(
        'SELECT *'
        ' FROM post_image image'
        ' WHERE image.id = ? AND image.post_id = ?',
        (image_id, post_id,)
    ).fetchone()

    if post_image is None:
        abort(404, f"Post Image id {id} doesn't exist.")

    return post_image


def get_post_like(post_id, user_id):
    like = get_db().execute(
        'SELECT * FROM post_like WHERE post_id = ? AND user_id = ?', (post_id, user_id)
    ).fetchone()

    if like is None:
        return None

    return like


def get_post_like_total(post_id):
    like_total = get_db().execute(
        'SELECT * FROM post_like WHERE post_id = ?', (post_id,)
    ).fetchall()

    return len(like_total)


def get_post_comments(post_id):
    post_comments = get_db().execute(
        'SELECT p.id, post_id, body, created, user_id, username'
        ' FROM post_comment p JOIN user u ON p.user_id = u.id'
        ' WHERE post_id = ?', (post_id,)
    ).fetchall()

    return post_comments


def get_post_images(post_id):
    post_images = get_db().execute(
        'SELECT * FROM post_image WHERE post_id = ?', (post_id,)
    ).fetchall()

    return post_images


@bp.route('/<int:id>/update', methods=('GET', 'POST'))
@login_required
def update(id):
    post = get_post(id)

    print('is_public')
    print(post['is_public'])

    if request.method == 'POST':
        title = request.form['title']
        body = request.form['body']
        error = None

        if not title:
            error = 'Title is required.'

        if error is not None:
            flash(error)
        else:
            db = get_db()
            db.execute(
                'UPDATE post SET title = ?, body = ?'
                ' WHERE id = ?',
                (title, body, id)
            )

            if 'file' in request.files:
                file = request.files['file']
                if file and file.filename != '':
                    if not allowed_file(file.filename):
                        flash('File must be JPG')
                        db.rollback()
                        return redirect(request.url)
                    filename = secure_filename(file.filename)
                    file.save(os.path.join(UPLOAD_FOLDER, filename))

                    db = get_db()
                    db.execute(
                        'INSERT INTO post_image (post_id, name)'
                        ' VALUES (?, ?)',
                        (id, filename)
                    )

            db.commit()
            return redirect(url_for('blog.index'))

    post_images = get_post_images(id)

    return render_template('blog/update.html', post=post, images=post_images)


@bp.route('/blog/<int:id>/make_public', methods=('GET', 'POST'))
@login_required
def make_public(id):
    post = get_post(id)
    is_public = 1

    if post['is_public']:
        is_public = 0

    if request.method == 'POST':
        db = get_db()
        db.execute(
            'UPDATE post SET is_public = ?'
            ' WHERE id = ?',
            (is_public, id)
        )
        db.commit()
    return jsonify("success")


@bp.route('/<int:post_id>/post_like')
@login_required
def post_like(post_id):
    like = get_post_like(post_id, g.user['id'])

    if like is None:
        db = get_db()
        db.execute(
            'INSERT INTO post_like (user_id, post_id)'
            ' VALUES (?, ?)',
            (g.user['id'], post_id)
        )
        db.commit()
    else:
        db = get_db()
        db.execute('DELETE FROM post_like WHERE post_id = ? AND user_id = ?', (post_id, g.user['id'],))
        db.commit()

    return redirect(url_for('blog.details', id=post_id))


@bp.route('/<int:id>/details')
@login_required
def details(id):
    post = get_post(id, False)
    like = get_post_like(id, g.user['id'])
    like_total = get_post_like_total(id)
    post_comments = get_post_comments(id)
    post_images = get_post_images(id)

    return render_template('blog/details.html', post=post, like=like, like_total=like_total,
                           post_comments=post_comments, images=post_images)


@bp.route('/<int:id>/delete', methods=('POST',))
@login_required
def delete(id):
    get_post(id)
    db = get_db()
    db.execute('DELETE FROM post WHERE id = ?', (id,))
    db.commit()
    return redirect(url_for('blog.index'))


@bp.route('/<int:post_id>/<int:image_id>/image_delete', methods=('POST',))
@login_required
def image_delete(post_id, image_id):
    get_post(post_id)
    get_post_image(post_id, image_id)
    db = get_db()
    db.execute('DELETE FROM post_image WHERE id = ?', (image_id,))
    db.commit()

    return redirect(url_for('blog.update', id=post_id))


@bp.route('/<int:post_id>/post_comment', methods=('GET', 'POST'))
@login_required
def post_comment(post_id):
    if request.method == 'POST':
        user_id = g.user['id']
        post_id = post_id
        body = request.form['body']
        error = None

        if not body:
            error = 'Body is required.'

        if error is not None:
            flash(error)
        else:
            db = get_db()
            db.execute(
                'INSERT INTO post_comment (user_id, post_id, body)'
                ' VALUES (?, ?, ?)',
                (user_id, post_id, body)
            )
            db.commit()

    return redirect(url_for('blog.details', id=post_id))


@bp.route('/<int:post_id>/<int:comment_id>/comment_delete', methods=('POST',))
@login_required
def comment_delete(post_id, comment_id):
    get_post(post_id)
    get_post_comment(comment_id, post_id, g.user['id'])
    db = get_db()
    db.execute('DELETE FROM post_comment WHERE id = ?', (comment_id,))
    db.commit()
    return redirect(url_for('blog.details', id=post_id))


def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS
