from flask import Flask, render_template, request, redirect, session, jsonify
from flask_session import Session
import requests
import json
from datetime import datetime
import mysql.connector
from werkzeug.exceptions import HTTPException
from email.message import EmailMessage
import ssl
import smtplib
import stripe
from config import session_secret_key, email_sender_, email_password_, publishable_key, secret_key, endpoint_secret, sql_user, sql_password

app = Flask(__name__) # flask
app.config["SESSION_PERMANENT"] = False # flask_session
app.config["SESSION_TYPE"] = "filesystem" # flask_session
Session(app) # flask_session
app.secret_key = session_secret_key # session
email_sender = email_sender_ # sendmails
email_password = email_password_ # sendmails
stripe_keys = { #stripe
    "publishable_key": publishable_key,
    "secret_key": secret_key,
    "endpoint_secret": endpoint_secret
}  # stripe
stripe.api_key = stripe_keys["secret_key"]

db = mysql.connector.connect(host="127.0.0.1", user=sql_user, password=sql_password, database="test")
cursor = db.cursor()

# login or home page
@app.route('/', methods=['GET', "POST"])
def login():
  msg = ''
  # if logged in is True
  if session.get('loggedin') == True:
    return render_template('home.html')



  if request.method == "POST":
    form_clicked = request.form.get("form")
    # subscribe click
    if (form_clicked == "subscribe"):
      email = request.form.get("email")
      cursor.execute('select * from subscribers where email = %s', (email,))
      row = cursor.fetchone()
      if row:
        msg = "You are already a subscriber!"
        return jsonify({'data': msg})
      else:
        cursor.execute("insert into subscribers (email) values (%s)", (email,))
        db.commit()
        msg = "You have successfully subscribed!"
        return jsonify({'data': msg})
    # sign in click
    elif (form_clicked == "sign_in"):
      email = request.form.get("email")
      password = request.form.get("password")
      cursor.execute('select * from users where email = %s AND password = %s', (email, password))
      user = cursor.fetchone()
      if user:   
        session['loggedin'] = True   
        session['id'] = user[0]
        session['email'] = user[1]
        msg = 'success'
        return jsonify({'data': msg})
      else:
        msg = 'fail'
        return jsonify({'data': msg})
    # forgot password click
    elif (form_clicked == "forgot_password"):
      email = request.form.get("email")
      cursor.execute('select * from users where email = %s', (email,))
      user = cursor.fetchone()
      if user:
        email_receiver = user[1] # sendmails
        new_password = "sdfsd" 
        subject = "Reset password"
        body = """\n
          Hi {name},\n\n          your new password is\n\n\n          {password} \n\n\n\n\n\n
          Thank you for using our services! 
        """.format(password=new_password, name=email_receiver.split('@')[0])
        em = EmailMessage()
        em['From'] = email_sender
        em['To'] = email_receiver
        em['subject'] = subject
        em.set_content(body)
        context = ssl.create_default_context()
        with smtplib.SMTP_SSL('smtp.gmail.com', 465, context=context) as smtp:
          smtp.login(email_sender, email_password)
          smtp.sendmail(email_sender, email_receiver, em.as_string())
        msg = 'success'
        return jsonify({'data': msg})
      else:
        msg = 'fail'
        return jsonify({'data': msg})
    # sign up click
    elif (form_clicked == "sign_up"):
      email = request.form.get("email")
      password = request.form.get("password")
      cursor.execute('select * from users where email = %s', (email,))
      user = cursor.fetchone()
      if user:
        msg = 'fail'
        return jsonify({'data': msg})
      else:
        cursor.execute("insert into users (email, password) values (%s, %s)", (email, password))
        db.commit()
        cursor.execute('select * from users where email = %s', (email,))
        user = cursor.fetchone()
        session['loggedin'] = True
        session['id'] = user[0]
        session['email'] = user[1]
        msg = 'success'
        return jsonify({'data': msg})
    # contact form click
    elif (form_clicked == "contact_form"):
      name = request.form.get("name")
      email = request.form.get("email")
      message = request.form.get("message")
      cursor.execute("insert into support (name, email, message) values (%s, %s, %s)", (name, email, message))
      db.commit()
      msg = 'success'
      return jsonify({'data': msg})

  return render_template('login3.html', msg=msg)

# process logout request
@app.route('/logout')
def logout():
  session.clear()
  return redirect("/")

# go to reservations page
@app.route('/reservations/<hotel>', methods=["GET", "POST"])
def reservations(hotel):
  if session.get('loggedin') == True:
    return render_template('reservations.html', hotel=hotel)
  else:
    return redirect("/")

# stripe 1st client call (default/on page load) - send publishable (public) key to client to create stripe checkout session
@app.route("/config")
def get_publishable_key():
  stripe_config = {"publicKey": stripe_keys["publishable_key"]}
  return jsonify(stripe_config)

# stripe 2nd client call (from checkout button click) creates checkout session
@app.route("/create-checkout-session", methods=["GET", "POST"])
def create_checkout_session():
  # send data to mysql with a "paid" status of "no" until successful payment
  hotel_data = request.get_json()
  paid = "no"
  cursor.execute("insert into reservations (email, hotel, from_date, to_date, rooms, adults, children, paid) values (%s, %s, %s, %s, %s, %s, %s, %s)", (session['email'], hotel_data['hotel_name'], hotel_data['from_date'], hotel_data['to_date'], hotel_data['rooms'], hotel_data['adults'], hotel_data['children'], paid))
  db.commit()

  # stripe checkout session
  domain_url = "http://127.0.0.1:5000/"
  stripe.api_key = stripe_keys["secret_key"]
  try:
    # Create new Checkout Session for the order
    # Other optional params include:
    # [billing_address_collection] - to display billing address details on the page
    # [customer] - if you have an existing Stripe Customer ID
    # [payment_intent_data] - capture the payment later
    # [customer_email] - prefill the email input in the form
    # For full details see https://stripe.com/docs/api/checkout/sessions/create

    hotel_name = hotel_data['hotel_name']

    if hotel_name == "Hotel Arma Executive":
      unit_amount = 5 * 100 * 180
    elif hotel_name == "Oritel Service Apartments":
      unit_amount = 5 * 100 * 120


    # ?session_id={CHECKOUT_SESSION_ID} means the redirect will have the session ID set as a query param
    checkout_session = stripe.checkout.Session.create(
      payment_method_types=["card"],
      line_items=[
        {
          'price_data': {
            'product': 'prod_Mxbv8rfX96Yl6E', # stripe dashboard product id
            'unit_amount': unit_amount, # stripe dashboard product price * 100 as per stripe regulations
            'currency': 'gbp', # stripe dashboard product currency
          },
          "quantity": 1,
        }
      ],
      mode="payment",
      success_url=domain_url + "success?session_id={CHECKOUT_SESSION_ID}",
      cancel_url=domain_url + "cancelled"
    )
    return jsonify({"sessionId": checkout_session["id"]})
  except Exception as e:
    return jsonify(error=str(e)), 403

# after successful payment
@app.route("/success")
def success():
  # update last inserted row id for given email with paid status
  paid = "yes"
  email = session['email']
  cursor.execute("update reservations set paid = %s where email = %s order by id desc limit 1", (paid, email))
  db.commit()

  # retrieve all data for last inserted row id for given email
  cursor.execute("select * from reservations where email = %s order by id desc limit 1", (email,))
  reservation = cursor.fetchone()

  #send email to user
  email_receiver = session['email'] # sendmails
  subject = "Payment successful"
  body = """\n
    Hi {name},\n\n    your payment was successful!\n\n\n
    You haved booked a stay with \n\n    {hotel} \n
    between {from_date} and {to_date}. \n\n\n
    Thank you for using our services!
  """.format(name=email_receiver.split('@')[0], hotel=reservation[2], from_date=reservation[3], to_date=reservation[4])
  em = EmailMessage()
  em['From'] = email_sender
  em['To'] = email_receiver
  em['subject'] = subject
  em.set_content(body)
  context = ssl.create_default_context()
  with smtplib.SMTP_SSL('smtp.gmail.com', 465, context=context) as smtp:
    smtp.login(email_sender, email_password)
    smtp.sendmail(email_sender, email_receiver, em.as_string())
    
  return render_template("success.html", email=email_receiver)

# after cancelled payment
@app.route("/cancelled")
def cancelled():
  # retrieve last inserted row id for given email and update the paid status to cancelled
  paid = "cancelled"
  email = session['email']
  cursor.execute("update reservations set paid = %s where email = %s order by id desc limit 1", (paid, email))
  db.commit()
  return render_template("cancelled.html", email=email)

# stripe webhook
@app.route("/webhook", methods=["POST"])
def stripe_webhook():
  payload = request.get_data(as_text=True)
  sig_header = request.headers.get("Stripe-Signature")

  try:
    event = stripe.Webhook.construct_event(
      payload, sig_header, stripe_keys["endpoint_secret"]
    )

  except ValueError as e:
    # Invalid payload
    return "Invalid payload", 400
  except stripe.error.SignatureVerificationError as e:
    # Invalid signature
    return "Invalid signature", 400

  # Handle the checkout.session.completed event
  if event["type"] == "checkout.session.completed":
    print("Payment was successful.")
    # TODO: run some custom code here

  return "Success", 200

# override flask's default "page not found" behaviour
@app.errorhandler(HTTPException)
def page_not_found(error):
  response = error.get_response()
  response.data = json.dumps({
    "code": error.code,
    "name": error.name,
    "description": error.description,
  })
  response.content_type = "application/json"
  return response

if __name__ == '__main__':
  app.run()
