'use strict';

const { Service } = require('@hapipal/schmervice');
const Boom = require('@hapi/boom');

module.exports = class FilmService extends Service {

    create(film) {

        const { Film } = this.server.models();

        return Film.query().insertAndFetch(film);
    }

    update(filmId, filmData) {

        const { Film } = this.server.models();

        return Film.query().patchAndFetchById(filmId, filmData);
    }

    delete(filmId) {

        const { Film } = this.server.models();

        return Film.query().deleteById(filmId);
    }

    list() {

        const { Film } = this.server.models();

        return Film.query().select('*');
    }

    getById(filmId) {

        const { Film } = this.server.models();

        return Film.query().findById(filmId);
    }

    async addFavorite(userId, filmId) {

        const { Favorite, Film } = this.server.models();

        const film = await Film.query().findById(filmId);

        if (!film) {
            throw Boom.notFound('Film not found');
        }

        const existing = await Favorite.query().findOne({ userId, filmId });

        if (existing) {
            throw Boom.conflict('This film is already in your favorites');
        }

        return Favorite.query().insertAndFetch({ userId, filmId });
    }

    async removeFavorite(userId, filmId) {

        const { Favorite } = this.server.models();

        const existing = await Favorite.query().findOne({ userId, filmId });

        if (!existing) {
            throw Boom.notFound('This film is not in your favorites');
        }

        await Favorite.query().deleteById(existing.id);

        return '';
    }

    async getFavorites(userId) {

        const { Favorite, Film } = this.server.models();

        const favorites = await Favorite.query().where({ userId });
        const filmIds = favorites.map((f) => f.filmId);

        if (filmIds.length === 0) {
            return [];
        }

        return Film.query().findByIds(filmIds);
    }
};
