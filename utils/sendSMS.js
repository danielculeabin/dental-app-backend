require('dotenv').config();
const { Vonage } = require('@vonage/server-sdk');

const vonage = new Vonage({
  apiKey: process.env.VONAGE_API_KEY,
  apiSecret: process.env.VONAGE_API_SECRET,
});

const sendSMS = async (to, text, time) => {
  // 1. Clean the number
  const cleanNumber = to.replace(/[^\d]/g, '');

  // 2. Define the "Fire" function
  const sendAction = async () => {
    try {
      const resp = await vonage.sms.send({
        to: cleanNumber,
        from: process.env.VONAGE_FROM_NAME || 'Vonage',
        text: text,
      });
      console.log(`Message delivered to ${cleanNumber}`);
      return resp;
    } catch (err) {
      console.error('Error sending SMS:', err);
    }
  };

  // 3. The Scheduling Logic (Math)
  if (time) {
    const nowUnix = Math.floor(Date.now() / 1000);
    const delayMs = (time - nowUnix) * 1000;

    // 4. The "Waiting Room"
    if (delayMs > 0) {
      const delayInMinutes = (delayMs / 1000 / 60).toFixed(1);
      console.log(`Scheduling reminder in ${delayInMinutes} minutes...`);

      // CRITICAL: This is the actual "alarm clock" line
      setTimeout(sendAction, delayMs);
      // We return here so we don't accidentally run the "Immediate Fallback" below
      return { status: 'scheduled', delayMs };
    }
  }

  // 4. The Immediate Fallback
  // If no time was provided (Confirmation) or time is in the past, fire now.
  return await sendAction();
};

module.exports = sendSMS;
