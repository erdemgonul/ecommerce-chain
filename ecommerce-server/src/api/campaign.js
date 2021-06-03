const express = require('express');
const campaignBAL = require('../bal/campaign');

const router = express.Router();

router.post('/create', async (req, res) => {
  const result = await campaignBAL.createCampaign(req.body.campaignType, req.body.validUntil, req.body.isActive, req.body.discountAmount, req.body.notificationDetails);

  if (result && !result.error) {
    res.send({ success: true, campaignId: result._id });
  } else {
    res.send(result);
  }
});

router.post('/get/active/all', async (req, res) => {
  const campaigns = await campaignBAL.getActiveCampaigns();

  if (campaigns && !campaigns.error) {
    res.send({ data: campaigns, success: true });
  } else {
    res.send(campaigns);
  }
});

router.post('/get', async (req, res) => {
  const campaign = await campaignBAL.getCampaignById(req.body.campaignId)

  if (campaign && !campaign.error) {
    res.send({ data: campaign, success: true });
  } else {
    res.send(campaign);
  }
});

router.post('/delete', async (req, res) => {
  const campaign = await campaignBAL.deleteCampaignWithId(req.body.campaignId);

  if (campaign && !campaign.error) {
    res.send({ success: true });
  } else {
    res.send(campaign);
  }
});

module.exports = router;
