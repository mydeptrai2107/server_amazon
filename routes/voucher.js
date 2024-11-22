const express = require('express');
const voucherRouter = express.Router();
const Voucher = require('../model/voucher');
const auth = require('../middlewares/auth');

voucherRouter.post('/api/vouchers', auth, async (req, res) => {
    try {
        const { code, discount, expirationDate } = req.body;

        if (!code || !discount || !expirationDate) {
            return res.status(400).json({ error: 'Code, discount, và expiration date là bắt buộc!' });
        }

        const newVoucher = new Voucher({
            code,
            discount,
            expirationDate,
        });

        await newVoucher.save();
        res.status(201).json(newVoucher);
    } catch (e) {
        res.status(500).json({ error: `${e.message} from server` });
    }
});

voucherRouter.get('/api/vouchers', auth, async (req, res) => {
    try {
        const vouchers = await Voucher.find({});
        res.json(vouchers);
    } catch (e) {
        res.status(500).json({ error: `${e.message} from server` });
    }
});

voucherRouter.get('/api/vouchers/validate/:code', auth, async (req, res) => {
    try {
        const voucher = await Voucher.findOne({ code: req.params.code });

        if (!voucher) {
            return res.status(404).json({ error: 'Voucher không tồn tại!' });
        }

        const currentDate = new Date();
        if (voucher.expirationDate < currentDate) {
            return res.status(400).json({ error: 'Voucher đã hết hạn!' });
        }

        res.json({ valid: true, voucher });
    } catch (e) {
        res.status(500).json({ error: `${e.message} from server` });
    }
});

module.exports = voucherRouter;
