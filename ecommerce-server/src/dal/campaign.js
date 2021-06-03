const db = require('../models');

const Campaign = db.campaign;
const moment = require('moment');

const self = {
  createCampaign: async (campaignType, validUntil, isActive, discountAmount) => {
    const createdOn = moment.utc().toDate();

    const campaign = new Campaign({
      campaignType, validUntil, isActive, discountAmount
    });

    try {
      const createdCampaign = await campaign.save();

      if (createdCampaign && createdCampaign._id) {
        return createdCampaign.toObject();
      }
    } catch (err) {
      return err;
    }
  },

  getActiveCampaigns: async () => {
    try {
      const result = [];

      const filter = {
        isActive: true
      }

      const campaigns = await Campaign.find(filter).exec();

      for (let campaign of campaigns) {
        result.push(campaign.toObject())
      }

      return result
    } catch (err) {
      return err;
    }
  },

  deleteCampaignWithId: async (campaignId) => {
    try {
      const campaign = await Campaign.findOne({
        _id: campaignId
      }).exec();

      if (campaign && campaign._id) {
        await campaign.remove();

        return true;
      }

      return false;
    } catch (err) {
      return err;
    }
  },

  getCampaignById: async (campaignId) => {
    try {
      const campaign = await Campaign.findOne({
        _id: campaignId
      }).exec();

      if (campaign && campaign._id) {
        return campaign.toObject();
      }
    } catch (err) {
      return err;
    }
  },
};

module.exports = self;
