"use strict";

const Env = use("Env");
const Promo = use("App/Models/Promo");
const Release = use("App/Models/Release");
const Database = use("Database");
const axios = require("axios");
const Helpers = use("Helpers");
const fs = Helpers.promisify(require("fs"));

const tg_api_url = `https://api.telegram.org/bot${Env.get(
  "BOT_TOKEN"
)}/sendMessage?chat_id=${Env.get("CHAT_ID")}&text=`;

class PromoController {
  async create({ request, auth }) {
    const release = await Release.find(request.input("id"));
    if (!release || release.user_id != auth.user.id || release.status != "ok") {
      return { error: 403 };
    }

    const testPromo = await Promo.findBy("release_id", release.id);
    if (testPromo) return { error: "Для этого релиза уже создано промо." };

    const promo = await Promo.create({
      release_id: release.id,
      payed: false,
      user_id: auth.user.id,
    });

    return { error: false, promo: promo };
  }

  async get({ request, auth }) {
    const promo = await Promo.find(request.input("id"));
    if (!promo) return { error: 404 };

    const release = await Release.find(promo.release_id);
    if (!release) {
      await promo.delete();
      return { error: "Релиз не найден." };
    }
    if (release.user_id != auth.user.id) return { error: false };

    return { error: false, promo: promo, release: release };
  }

  async edit({ request, auth }) {
    const promo = await Promo.find(request.input("id"));
    if (!promo) return { error: 404 };
    if (promo.payed == true) return { error: 403 };

    const release = await Release.find(promo.release_id);
    if (!release) {
      await promo.delete();
      return { error: "Релиз не найден." };
    }
    if (release.user_id != auth.user.id) return { error: false };

    const { desc, social, focus } = request.all();

    promo.desc = desc;
    promo.social = social;
    promo.promo = request.input("promo");
    promo.focus = focus;

    const photoFile = request.file("photo", { types: ["image"], size: "10mb" });
    if (photoFile) {
      if (promo.photo) {
        await fs.unlink(Helpers.publicPath(promo.photo));
      }
      const secret = this.generateSecret(30);
      await photoFile.move(Helpers.publicPath(`/photos/${auth.user.id}`), {
        name: `${secret}.jpg`,
        overwrite: false,
      });

      if (!photoFile.moved()) {
        return { error: photoFile.error() };
      }

      promo.photo = `/photos/${auth.user.id}/${secret}.jpg`;
    }

    await promo.save();
    return { error: false };
  }

  async send({ request, auth }) {
    const promo = await Promo.find(request.input("id"));
    if (!promo) return { error: 404 };
    if (promo.payed == true) return { error: 403 };

    const release = await Release.find(promo.release_id);
    if (!release) {
      await promo.delete();
      return { error: "Релиз не найден." };
    }
    if (release.user_id != auth.user.id) return { error: false };

    if (!promo.desc || !promo.social || !promo.photo) {
      return { error: "Заполните все обязательные поля." };
    }

    promo.payed = true;
    await promo.save();

    const text = `Пользователь ${auth.user.email} отправил промо на релиз:\n\n${release.artists} - ${release.title}\n\nhttps://${Env.get("URL")}/admin/promo/${promo.id}`;
    await axios.get(encodeURI(`${tg_api_url}${text}`));

    return { error: false, promo: promo };
  }

  async get_promos({ auth }) {
    const promos = await Database.table("promos")
      .where("user_id", auth.user.id)
      .orderBy("created_at", "desc");

    const promoReleases = [];
    for (const promo of promos) {
      const release = await Release.find(promo.release_id);
      if (!release) {
        const promoD = await Promo.find(promo.id);
        await promoD.delete();
      } else {
        promoReleases.push({ id: promo.id, payed: promo.payed, release });
      }
    }

    return { error: false, promos: promoReleases };
  }

  async price() {
    return {
      error: false,
      price: Env.get("PRICE"),
      old_price: Env.get("OLDPRICE"),
    };
  }

  generateSecret(length) {
    const symbols = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let secret = "";
    for (let i = 0; i < length; i++) {
      secret += symbols.charAt(Math.floor(Math.random() * symbols.length));
    }
    return secret;
  }
}

module.exports = PromoController;