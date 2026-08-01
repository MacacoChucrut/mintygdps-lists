import home from '../pages/home.js';
import list from '../pages/list.js';
import leaderboard from '../pages/leaderboard.js';
import roulette from '../pages/roulette.js';
import packs from '../pages/packs.js';

export default [
    { path: '/', component: home },

    {
        path: '/:listName',
        component: list,
        props: true
    },
    {
        path: '/:listName/leaderboard',
        component: leaderboard,
        props: true
    },
    {
        path: '/:listName/packs',
        component: packs,
        props: true
    },
    {
        path: '/:listName/roulette',
        component: roulette,
        props: true
    }
];