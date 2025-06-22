function isAkun(target, randomName) {
  return `
I respectfully request the immediate, temporary suspension of the following Telegram account: [${target}]. I have been defrauded of USD 674, and my bank details were compromised in the process.

To prevent any further victims, please block this account without delay. I am prepared to provide additional evidence upon request.

Thank you for your prompt attention to this urgent matter.

Sincerely,
[${randomName}]`;
}

function isChannel(target) {
  return `
Dear Telegram Support Team,

I would like to report a channel that contains pornographic content and is actively distributing it, as well as engaging in the sale of illegal goods.

I urge Telegram to take strict and immediate action to block this channel in order to uphold community safety and platform integrity.

Thank you for your attention and swift response.
Channel ${randomName}`;
}

module.exports = {
  isAkun, isChannel
};

