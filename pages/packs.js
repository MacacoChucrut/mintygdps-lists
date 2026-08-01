import { fetchPacks, fetchList } from "../js/content.js";
import { getThumbnailFromId, getYoutubeIdFromUrl } from "../js/utils.js";

import Spinner from "../js/spinner.js";

export default {
    components: {
        Spinner,
    },

    props: {
        listName: String,
    },

    template: `
        <main v-if="loading">
            <Spinner />
        </main>

        <main v-else class="page-packs">
            <div class="packs-container">
                <div class="packs-scroll">
                    <table class="packs-list">
                        <tr v-for="(pack, i) in packs">
                            <td class="pack" :class="{ active: selectedPack === i }">
                                <span class="pack-prefix">-</span>
                                <button @click="selectedPack = i">
                                    <span class="type-label-lg">
                                        {{ pack.name }}
                                    </span>
                                </button>
                            </td>
                        </tr>
                    </table>
                </div>
            </div>

            <div class="pack-container">
                <div class="pack">

                    <h1>
                        {{ pack.name }}
                    </h1>

                    <ul class="stats" v-if="pack.reward > 0">
                        <li>
                            <div class="type-title-sm">Points when completed</div>
                            <p>{{ pack.reward }}</p>
                        </li>
                    </ul>

                    <div
                        class="pack-reward warning"
                        v-if="pack.reward <= 0"
                    >
                        {{ pack.warning }}
                    </div>

                    <h2>Levels</h2>

                    <div class="pack-levels">
                        <ul>
                            <li v-for="level in pack.levelObjects">
                                <a
                                    class="level-item"
                                    :href="level.video"
                                    target="_blank"
                                >

                                    <div class="level-content">
                                        <img
                                            v-if="level.thumbnail"
                                            :src="level.thumbnail"
                                            class="level-thumb"
                                        >

                                        <span class="level-name">
                                            #{{ level.rank }} - {{ level.name }}
                                        </span>

                                    </div>
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </main>
    `,

    data: () => ({
        loading: true,
        packs: [],
        list: [],
        selectedPack: 0,
    }),

    computed: {

        pack() {
            return this.packs[this.selectedPack];
        }

    },

    async mounted() {

        this.list = await fetchList(this.listName);

        const packs = await fetchPacks(this.listName);

        this.packs = packs.map(pack => {

            const levelObjects = pack.levels
                .map(path => {

                    const entry = this.list.find(([lvl]) =>
                        lvl && lvl.path === path
                    );

                    if (!entry)
                        return null;

                    const [lvl] = entry;

                    const hasVideo =
                        lvl.verification &&
                        lvl.verification.trim() !== "" &&
                        lvl.verification !== "#";

                    return {

                        path,

                        name: lvl.name,

                        rank: this.list.indexOf(entry) + 1,

                        video: lvl.verification,

                        thumbnail: hasVideo
                            ? getThumbnailFromId(
                                getYoutubeIdFromUrl(
                                    lvl.verification
                                )
                            )
                            : null

                    };

                })
                .filter(Boolean)
                .sort((a, b) => a.rank - b.rank);

            return {

                ...pack,

                levelObjects,

            };

        });

        this.loading = false;

    },

    methods: {

        getThumbnailFromId,
        getYoutubeIdFromUrl,

    },

};