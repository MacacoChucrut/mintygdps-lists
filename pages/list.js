import { embed } from "../js/utils.js";
import { score } from "../js/utils.js";
import { fetchEditors, fetchList } from "../js/content.js";

import Spinner from "../js/spinner.js";
import LevelAuthors from "../js/levelauthors.js";

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
    components: { Spinner, LevelAuthors },
    props: {
        listName: String
    },
    template: `
        <main v-if="loading">
            <Spinner></Spinner>
        </main>

        <main v-else class="page-list">

            <div class="list-container">
            
                <div class="search-container">
                    <input 
                        v-model="searchQuery"
                        type="text"
                        placeholder="Search levels..."
                        class="search-input"
                    />
                </div>

                <div class="list-scroll">

                    <table class="list" v-if="filteredList.length > 0">
                        <template v-for="(item, i) in filteredList" :key="i">

                            <tr v-if="item.originalIndex + 1 === 201" class="separator-row">
                                <td colspan="2">
                                    <div class="separator-text">LEGACY</div>
                                </td>
                            </tr>

                            <tr>
                                <td class="rank">
                                    <p class="type-label-lg"
                                       :style="{
                                           color: getRankColor(item.originalIndex + 1) || 'inherit',
                                       }">
                                        #{{ item.originalIndex + 1 }}
                                    </p>
                                </td>

                                <td class="level"
                                    :class="{ 'active': selected === item.originalIndex, 'error': !item.data }"
                                    :style="{'--outline-color': getRankColor(item.originalIndex + 1) || 'var(--color-on-background)'}">

                                    <button 
                                        @click="selected = item.originalIndex"
                                        :style="{ color: getRankColor(item.originalIndex + 1) || 'inherit' }"
                                    >
                                        <span class="type-label-lg">
                                            {{ item.data?.name || \`Error (\${item.error}.json)\` }}
                                        </span>
                                    </button>
                                </td>
                            </tr>

                        </template>
                    </table>

                    <p v-else style="text-align:center; padding:1rem; opacity:0.7;">
                        No levels found.
                    </p>
                </div>
            </div>

            <div class="level-container">
                <div class="level" v-if="level">
                    <h1>{{ level.name }}</h1>

                    <LevelAuthors 
                        :creators="level.creators" 
                        :verifier="level.verifier">
                    </LevelAuthors>

                    <div style="display:flex;">
                        <div v-for="tag in level.tags" class="tag">{{ tag }}</div>
                    </div>

                    <div v-if="level.showcase" class="tabs">
                        <button 
                            class="tab" 
                            :class="{selected: !toggledShowcase}" 
                            @click="toggledShowcase = false"
                        >
                            <span class="type-label-lg">Verification</span>
                        </button>

                        <button 
                            class="tab" 
                            :class="{selected: toggledShowcase}" 
                            @click="toggledShowcase = true"
                        >
                            <span class="type-label-lg">Showcase</span>
                        </button>
                    </div>


                    <iframe
                        v-if="video"
                        class="video"
                        id="videoframe"
                        :src="video"
                        frameborder="0">
                    </iframe>

                    <div class="no-video" v-if="!video && !toggledShowcase">
                        <p style="opacity:0.6; margin:1rem 0 1rem;">
                            No verification video available for this level.
                        </p>
                    </div>

                    <ul class="stats">
                        <li>
                            <div class="type-title-sm">Points when completed</div>
                            <p>{{ score(selected + 1) }}</p>
                        </li>
                        <li>
                            <div class="type-title-sm">ID</div>
                            <p>{{ level.id }}</p>
                        </li>
                        <li v-if="level.fps">
                            <div class="type-title-sm">FPS</div>
                            <p>{{ level.fps }}</p>
                        </li>
                        <li v-if="level.method">
                            <div class="type-title-sm">Method</div>
                            <p>{{ level.method }}</p>
                        </li>
                    </ul>

                    <h2>Victors ({{ level.records?.length || 0 }})</h2>

                    <table class="records">
                        <tr v-for="record in level.records" class="record">
                            <td class="user">
                                <a :href="record.link"
                                   target="_blank"
                                   class="type-label-lg">
                                    • {{ record.user }}
                                </a>
                            </td>
                        </tr>
                    </table>
                </div>

                <div v-else class="level"
                     style="height:100%; display:flex; justify-content:center; align-items:center;">
                    <p>(ノಠ益ಠ)ノ彡┻━┻</p>
                </div>
            </div>
        </main>
    `,

    data: () => ({
        list: [],
        filteredList: [],
        editors: [],
        loading: true,
        selected: 0,
        searchQuery: "",
        errors: [],
        toggledShowcase: false,
    }),

    computed: {
        level() {
            return this.list[this.selected]?.[0];
        },

        video() {
            if (!this.level) return null;

            if (this.toggledShowcase) {
                if (
                    this.level.showcase &&
                    this.level.showcase.trim() !== "" &&
                    this.level.showcase.trim() !== "#"
                ) {
                    return embed(this.level.showcase);
                }
                return null;
            }

            if (
                this.level.verification &&
                this.level.verification.trim() !== "" &&
                this.level.verification.trim() !== "#"
            ) {
                return embed(this.level.verification);
            }

            return null;
        }
    },

    watch: {
        searchQuery() {
            this.applyFilter();
        }
    },

    async mounted() {
        this.list = await fetchList(this.listName);
        this.editors = await fetchEditors();

        if (!this.list) {
            this.errors = ["Failed to load list."];
            this.loading = false;
            return;
        }

        this.filteredList = this.list.map((entry, index) => ({
            data: entry[0],
            error: entry[1],
            originalIndex: index
        }));

        this.loading = false;
    },

    methods: {
        embed,
        score,
        getRankColor,

        applyFilter() {
            const q = this.searchQuery.trim().toLowerCase();

            if (!q) {
                this.filteredList = this.list.map((entry, index) => ({
                    data: entry[0],
                    error: entry[1],
                    originalIndex: index
                }));
                return;
            }

            const isNumberSearch = /^\d+$/.test(q);
            const isHashSearch = /^#\d+$/.test(q);

            let desiredExactIndex = null;

            if (isHashSearch) {
                desiredExactIndex = parseInt(q.slice(1), 10) - 1;
            }

            this.filteredList = this.list
                .map((entry, index) => ({
                    data: entry[0],
                    error: entry[1],
                    originalIndex: index
                }))
                .filter(item => {

                    if (desiredExactIndex !== null) {
                        return item.originalIndex === desiredExactIndex;
                    }

                    if (isNumberSearch) {
                        const pos = (item.originalIndex + 1).toString();
                        if (pos.includes(q)) return true;
                    }

                    return (
                        item.data &&
                        item.data.name.toLowerCase().includes(q)
                    );
                });
        }
    }
};
