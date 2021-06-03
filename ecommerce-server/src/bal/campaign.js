const campaignDAL = require('../dal/campaign');

const self = {
    async createCampaign(campaignType, validUntil, isActive, discountAmount) {
        const createdCampaign = await campaignDAL.createCampaign(campaignType, validUntil, isActive, discountAmount);

        if (createdCampaign) {
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
