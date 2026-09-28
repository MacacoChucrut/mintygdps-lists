import { fetchLeaderboard, fetchPacks, fetchList } from '../js/content.js';
import { localize } from '../js/utils.js';
import Spinner from '../js/spinner.js';

function getRankColor(rank) {
    if (rank === 1) return '#fd0';
    if (rank === 2) return '#bbb';
    if (rank === 3) return '#c73';
    if (rank === 4) return '#5cc';
    if (rank === 5) return '#97e';
    if (rank > 200) return 'var(--color-legacy)';
    return null;
}

export default {
    components: { Spinner },
    props: {
        listName: String
    },
    data: () => ({
        leaderboard: [],
        loading: true,
        selected: 0,
        err: [],
        packs: [],
        allLevels: []
    }),
    template: `
        <main v-if="loading">
            <Spinner></Spinner>
        </main>
        <main v-else class="page-leaderboard-container">
            <div class="page-leaderboard">

                <div class="error-container">
                    <p class="error" v-if="err.length > 0">
                        Leaderboard may be incorrect, as the following levels could not be loaded: {{ err.join(', ') }}
                    </p>
                </div>

                <div class="board-container">
                    <table class="board">
                        <tr v-for="(ientry, i) in leaderboard" :key="i">
                            <td class="rank">
                                <p class="type-label-lg" :id="'rank-' + i">
                                    #{{ i + 1 }}
                                </p>
                            </td>

                            <td class="total">
                                <p class="type-label-lg" :id="'total-' + i">
                                    {{ localize(ientry.total) }}
                                </p>
                            </td>

                            <td
                                class="user"
                                :class="{ 'active': selected == i }"
                                :style="{
                                    '--outline-color': getRankColor(i + 1) || 'var(--color-on-background)'
                                }"
                            >
                                <button @click="selected = i">
                                    <span class="type-label-lg" :id="'user-' + i">
                                        {{ ientry.user }}
                                    </span>
                                </button>
                            </td>
                        </tr>
                    </table>
                </div>

                <div class="player-container">
                    <div class="player" v-if="entry">

                        <h1>#{{ selected + 1 }} {{ entry.user }}</h1>
                        <h3>{{ entry.total }}</h3>

                        <h2 v-if="entry.packsCompleted && entry.packsCompleted.length > 0">
                            Packs Completed ({{ entry.packsCompleted.length }})
                        </h2>

                        <table class="table" v-if="entry.packsCompleted.length > 0">
                            <tr v-for="pack in entry.packsCompleted" :key="pack.name">
                                <td class="rank">
                                    <p>-</p>
                                </td>
                                <td class="level">
                                    <span class="type-label-lg">
                                        {{ pack.name }}
                                    </span>
                                </td>
                            </tr>
                        </table>

                        <h2 v-if="entry.verified.length > 0">
                            Verified ({{ entry.verified.length }})
                        </h2>

                        <table class="table">
                            <tr v-for="score in entry.verified" :key="score.level">
                                <td class="rank">
                                    <p>#{{ score.rank }}</p>
                                </td>
                                <td class="level">
                                    <a class="type-label-lg" target="_blank" :href="score.link">
                                        {{ score.level }}
                                    </a>
                                </td>
                                <td class="score">
                                    <p v-if="score.score !== 0">
                                        +{{ localize(score.score) }}
                                    </p>
                                </td>
                            </tr>
                        </table>

                        <h2 v-if="entry.completed.length > 0">
                            Completed ({{ entry.completed.length }})
                        </h2>

                        <table class="table">
                            <tr v-for="record in entry.completed" :key="record.level">
                                <td class="rank">
                                    <p>#{{ record.rank }}</p>
                                </td>
                                <td class="level">
                                    <a class="type-label-lg" target="_blank" :href="record.link">
                                        {{ record.level }}
                                    </a>
                                </td>
                                <td class="score">
                                    <p v-if="record.score !== 0">
                                        +{{ localize(record.score) }}
                                    </p>
                                </td>
                            </tr>
                        </table>

                        <div class="uncompleted-title">
                            <h2 v-if="uncompletedLevels.length > 0">
                                Uncompleted ({{ uncompletedLevels.length }})
                            </h2>
                        </div>

                        <table class="table">
                            <div class="uncompleted">
                                <tr v-for="level in uncompletedLevels" :key="level.name">
                                    <td class="rank">
                                        <p>#{{ level.rank }}</p>
                                    </td>
                                    <td class="level">
                                        <span class="type-label-lg">
                                            {{ level.name }}
                                        </span>
                                    </td>
                                </tr>
                            </div>
                        </table>

                    </div>
                </div>
            </div>
        </main>
    `,
    computed: {
        entry() {
            return this.leaderboard[this.selected];
        },

        uncompletedLevels() {
            if (!this.entry || this.allLevels.length === 0) return [];

            const completedNames = [
                ...this.entry.completed.map(l => l.path),
                ...this.entry.verified.map(l => l.path)
            ];

            return this.allLevels.filter(lvl =>
                !completedNames.includes(lvl.path)
            );
        }
    },
    async mounted() {
        this.loading = true;

        const [leaderboard, err] = await fetchLeaderboard(this.listName);
        const excludedUsers = [
            "None",
            "ribbonera",
            "Artimae",
            "KanyeWestOfficial",
            "Dino",
            "Vertix",
            "Verim",
            "ForbidBasket",
            "Cash",
            "Cashy"
        ];

        this.leaderboard = leaderboard.filter(
            player => !excludedUsers.includes(player.user)
        );

        this.err = err;

        try {
            this.packs = await fetchPacks(this.listName);
        } catch {
            console.warn("Could not load packs.");
        }

        try {
            const list = await fetchList(this.listName);

            if (list) {
                this.allLevels = list
                    .map(([lvl], index) => lvl ? {
                        name: lvl.name,
                        path: lvl.path,
                        rank: index + 1
                    } : null)
                    .filter(Boolean);
            }
        } catch {
            console.warn("could not load full level list.");
        }

        this.loading = false;
        this.applyRankEffects();
    },
    methods: {
        localize,
        getRankColor,

        applyRankEffects() {
            this.$nextTick(() => {
                for (let i = 0; i < this.leaderboard.length; i++) {
                    const color = getRankColor(i + 1);

                    if (!color) continue;

                    const rank = document.querySelector(`#rank-${i}`);
                    const user = document.querySelector(`#user-${i}`);
                    const total = document.querySelector(`#total-${i}`);

                    if (rank) rank.style.color = color;
                    if (user) user.style.color = color;
                    if (total) total.style.color = color;
                }
            });
        }
    }
};