import sgMail from "@sendgrid/mail";

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendMail = (email, token) => {
  const msg = {
    to: email,
    from: "n.nestertsovv@gmail.com",
    subject: "Password recovery | Water Tracker",
    html: `<a href="${process.env.FRONT_URL}/api/users/change-password/${token}">Click for reset your password.</a>`,
  };

  sgMail
    .send(msg)
    .then(() => {
      console.log("Email sent");
    })
    .catch((error) => {
      console.error(error);
    });
};

export default sendMail;
