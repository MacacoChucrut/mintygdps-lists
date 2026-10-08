import Spinner from "../js/spinner.js";
import { fetchEditors } from "../js/content.js";

export default {
    components: {
        Spinner,
    },

    template: `
        <main class="page-home">
            <Spinner v-if="loading" />
            <template v-else>

                <section class="home-main">
                    <div class="home-intro">
                        <h1>MINTY</h1>
                        <h1>LISTS</h1>
                    </div>

                    <div class="home-divider"></div>

                    <div class="editors-section">
                        <div class="section-heading">
                            <h2>List Editors</h2>
                        </div>
                            
                        <div class="editors">
                            <a v-for="editor in editors"
                                :key="editor.name"
                                :href="editor.link"
                                target="_blank"
                                class="editor-card">
                            
                                <span class="editor-name">
                                    • {{ editor.name }}
                                </span>
                            </a>
                        </div>
                    </div>

                    <div class="home-footer1">
                        Layout made by <a href="https://tsl.pages.dev/" target="_blank">TheShittyList (TSL)</a>
                    </div>
                    <div class="home-footer2">
                        Certain features inspired by <a href="https://aredl.net" target="_blank">AREDL</a>
                    </div>
                </section>

                <section class="requirements">
                    <div class="rules-title">
                        <h2>Rules</h2>
                    </div>
                    
                    <div class="rules-selector">
                        <button v-for="rule in ruleSections"
                            :key="rule.id"
                            class="rule-button"
                            :class="{ active: selectedRule === rule.id }"
                            @click="selectedRule = rule.id"
                            >
                            {{ rule.name }}
                        </button>
                    </div>

                    <div class="rules-panel">
                        <template
                            v-for="rule in ruleSections"
                            :key="rule.id"
                            >
                                <div v-if="selectedRule === rule.id">
                                    <h3>{{ rule.name }}</h3>
                                    <ul>
                                        <li
                                            v-for="(item, index) in rule.rules"
                                            :key="index"
                                            v-html="item">
                                        </li>
                                    </ul>
                                </div>
                        </template>
                    </div>
                </section>
            </template>
        </main>
    `,

    data: () => ({
    loading: true,
    editors: [],
    selectedRule: "general",
    ruleSections: [
        {
            id: "general",
            name: "General Rules",
            category: "ALL LISTS",
            rules: [
                "<strong>You must follow these rules across all lists.</strong>",
                "Verifications must be uploaded to YouTube or Medal.",
                "Your clicks must be fully audible throughout the entire completion.",
                "Click sound mods and clickbots are not allowed.",
                "Cheat indicator is required if a modmenu with that feature is being used.",
                "You may not use any disallowed mods. A list of what we allow and don't allow can be found <a href=\"https://docs.google.com/spreadsheets/d/1M4vXMxHcYwtstB6SD9r4lPFotUXhz3IL9D_3JX8tjyE/edit?gid=1204643762#gid=1204643762\" target=\"_blank\">here.</a>",
                "Your record must show the stats on the \"Level Complete!\" and stats endscreen (attempts, orbs, etc).",
                "You may not use any skips that make any section of the level significantly easier.",
                "A maximum of 2 keybinds are allowed per player.",
                "If a level specifies a Method and/or FPS, you must follow those parameters. If left blank, any method or FPS setup is allowed. A list of all methods can be found <a href=\"https://docs.google.com/document/d/1PMr1f_CiVhmBbt4OWfdwy_V5_n1AS4zIqzdhFm1VdBg/edit?usp=sharing\" target=\"_blank\">here.</a>",
                "Changing your FPS mid-attempt is not allowed."
            ]
        },

        {
            id: "demonlist",
            name: "Demonlist",
            category: "DEMONLIST",
            rules: [
                "Video proof is required for <strong>Top 60 Demons.</strong>",
                "If your record is in the Top 3, you must have raw footage with isolated clicks, uploaded in a downloadable format (e.g. Google Drive) and submitted along with your public video."
            ]
        },

        {
            id: "pemonlist",
            name: "Pemonlist",
            category: "PEMONLIST",
            rules: [
                "Video proof is required for the <strong>Top 1 Pemon.</strong>"
            ]
        },

        {
            id: "challenge",
            name: "Challenge List",
            category: "CHALLENGE LIST",
            rules: [
                "Video proof is required for <strong>Top 50 Challenges.</strong>",
                "Levels can last up to 29 seconds.",
                "Random Triggers are allowed as long as all outcomes are of equal difficulty. They may not affect the gameplay or visual difficulty.",
                "Copying levels is allowed as long as significant modifications are made to the gameplay or decoration. Direct copies or slightly edited versions are not allowed.",
                "Reuploaded levels are judged more strictly to prevent low quality or joke levels from filling the list.",
                "Reuploaded levels cannot be Top #1 difficulty.",
            ]
        },

        {
            id: "unrated",
            name: "Unrated List",
            category: "UNRATED LIST",
            rules: [
                "Video proof is required for <strong>Top 5 levels.</strong>",
                "Levels must be at least 30 seconds long.",
                "Levels must be at least Easy Demon difficulty (GDPS standards).",
                "Random Triggers are allowed as long as all outcomes are of equal difficulty. They may not affect the gameplay or visual difficulty.",
                "Copying levels is allowed as long as significant modifications are made to the gameplay or decoration. Direct copies or slightly edited versions are not allowed.",
                "Reuploaded levels are judged more strictly to prevent low quality or joke levels from filling the list.",
                "Reuploaded levels cannot be Top #1 difficulty.",
            ]
        },

        {
            id: "impossible",
            name: "Impossible List",
            category: "IMPOSSIBLE LIST",
            rules: [
                "Levels must be at least 30 seconds long.",
                "Levels must be at least Extreme Demon difficulty. (GDPS standards.)",
                "If a level that's harder than the current hardest completed level is verified, it skips quality control",
                "Levels must be physically possible on 2.2 and passable from beginning to end in normal mode on at least one frame-rate. (Changing FPS mid-attempt is not allowed.)",
                "Triggers which count frames with the intent to force frame perfects are disallowed. This is due to the ease of creating extreme difficulty and overall low effort required in both playtesting and creating.",
                "Random Triggers are allowed as long as all outcomes are of equal difficulty. They may not affect the gameplay or visual difficulty.",
                "Levels may not include sections where the total number of clicks per player exceeds 16 per second or 3 in a single frame.",

                "Levels determined to be low effort and considered to not have any distinctive or creative quality, will likely not be added to the list.",
                "Copying levels is allowed as long as significant modifications are made to the gameplay or decoration. Direct copies or slightly edited versions are not allowed.",
                "Reuploaded levels are judged more strictly to prevent low quality or joke levels from filling the list.",
                "Reuploaded levels cannot be Top #1 difficulty.",
            ]
        }
    ]
}),

    async mounted() {
        this.editors = await fetchEditors();
        this.loading = false;
    },
};
