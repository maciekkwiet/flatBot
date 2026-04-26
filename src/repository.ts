import mongoose from 'mongoose';

const flatOfferSchema = new mongoose.Schema({
  url: { type: String, required: true, unique: true },
  type: { type: String, required: true },
  seenAt: { type: Date, default: Date.now },
});

const FlatOfferModel = mongoose.model('FlatOffer', flatOfferSchema);

export const flatOfferRepository = {
  async findExistingUrls(urls: string[], _type: string): Promise<string[]> {
    const docs = await FlatOfferModel.find({ url: { $in: urls } })
      .select('url')
      .lean();
    return docs.map((d: any) => d.url);
  },

  async upsertUrls(urls: string[], type: string): Promise<void> {
    if (urls.length === 0) return;
    const ops = urls.map(url => ({
      updateOne: {
        filter: { url },
        update: { $setOnInsert: { url, type, seenAt: new Date() } },
        upsert: true,
      },
    }));
    await FlatOfferModel.bulkWrite(ops);
  },
};

