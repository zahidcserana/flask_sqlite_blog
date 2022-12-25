import functools

import bcrypt
from flask import (
    Blueprint, flash, g, redirect, render_template, request, session, url_for
)
from sqlalchemy import create_engine, exc
from sqlalchemy.orm import sessionmaker

from models import UserModel

bp = Blueprint('auth', __name__, url_prefix='/auth')

USER_UID_KEY = 99

session_maker = sessionmaker(bind=create_engine('mysql+pymysql://root:tr$cKy22@localhost/personal'))


@bp.route('/register', methods=('GET', 'POST'))
def register():
    with session_maker() as db_session:
        if request.method == 'POST':
            data = request.form

            username = data['username']
            password = data['password']
            error = None

            if not username:
                error = 'Username is required.'
            elif not password:
                error = 'Password is required.'

            if error is None:
                try:
                    user = UserModel(
                        username=username
                    )
                    user.set_password(password)
                    db_session.add(user)
                    db_session.commit()

                    user.set_uuid()
                    db_session.add(user)

                    db_session.commit()
                except exc.DatabaseError:
                    error = f"User {username} is already registered."
                else:
                    return redirect(url_for("auth.login"))

            flash(error)

    return render_template('auth/register.html')


@bp.route('/login', methods=('GET', 'POST'))
def login():
    with session_maker() as db_session:
        if request.method == 'POST':
            username = request.form['username']
            password = request.form['password']
            error = None

            # stmt = select(UserModel).where(UserModel.username == username)
            # user = db_session.execute(stmt).fetchone()

            user = db_session.query(UserModel).filter_by(username=username).first()

            if user is None:
                error = 'Incorrect username.'
            elif not user.check_password(password):
                error = 'Incorrect password.'

            if error is None:
                session.clear()
                session['user_id'] = user.id

                return redirect(url_for('index'))

            flash(error)

        return render_template('auth/login.html')


def verify_password(user, password):
    enc_pw = password.encode('utf-8')
    password = bcrypt.hashpw(enc_pw, bcrypt.gensalt()).decode('utf-8')

    enc_pw = password.encode('utf-8')
    return bcrypt.checkpw(enc_pw, bytes(user.password, 'utf-8'))


@bp.before_app_request
def load_logged_in_user():
    with session_maker() as db_session:
        user_id = session.get('user_id')

        if user_id is None:
            g.user = None
        else:
            try:
                g.user = db_session.query(UserModel).filter_by(id=user_id).first()
            except exc.DatabaseError:
                session.clear()
                return redirect(url_for('index'))


@bp.route('/logout')
def logout():
    session.clear()
    return redirect(url_for('index'))


def login_required(view):
    @functools.wraps(view)
    def wrapped_view(**kwargs):
        if g.user is None:
            return redirect(url_for('auth.login'))

        return view(**kwargs)

    return wrapped_view
