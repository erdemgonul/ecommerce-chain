const campaignDAL = require('../dal/campaign');
const moment = require('moment')

const self = {
    async createCampaign(campaignType, validUntil, isActive, discountAmount) {
        if (isActive) {
            const validTimeDiff = moment.utc().diff(validUntil, 'second');

            if (validTimeDiff > 0) {
                return {error: 'Activate campaign\'s for past dates cannot be created!'};
            }
        }

        const createdCampaign = await campaignDAL.createCampaign(campaignType, validUntil, isActive, discountAmount);

        if (createdCampaign) {
            console.log(createdCampaign)
            return createdCampaign;
        }

        return {error: 'Campaign creation failed !'};
    },

    async deleteCampaignWithId(campaignId) {
        return await campaignDAL.deleteCampaignWithId(campaignId);
    },

    async getActiveCampaigns() {
        return await campaignDAL.getActiveCampaigns();
    },

    async getCampaignById(campaignId) {
        return await campaignDAL.getCampaignById(campaignId);
    }
};

module.exports = self;
