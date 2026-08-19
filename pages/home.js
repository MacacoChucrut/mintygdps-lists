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
                    <h1>Welcome to the MintyGDPS Lists</h1>
                    <hr>
                    <p class="credits">
                        Website layout made by
                        <a href="https://tsl.pages.dev/" target="_blank">
                            TheShittyList (TSL)
                        </a>
                    </p>
                    <hr>
                    <h2>List Editors</h2>
                        <div class="editors">
                            <a
                                v-for="editor in editors"
                                :key="editor.name"
                                :href="editor.link"
                                target="_blank"
                                class="editor-card"
                            >
                                - {{ editor.name }}
                            </a>
                        </div>
                </section>

                <section class="requirements">
                    <a href="https://mintygdps-lists.vercel.app/templatething.html" target="_blank" style="text-decoration: none"><h2>GENERAL RULES</h2></a>
                        <li><strong>You must follow these rules across all lists.</strong></li>
                        <li>Verifications must be uploaded to YouTube or Medal.</li>
                        <li>Your clicks must be fully audible throughout the entire completion.</li>
                        <li>Click sound mods and clickbots are not allowed.</li>
                        <li>Cheat indicator is required if a modmenu with that feature is being used.</li>
                        <li>You may not use any disallowed mods. A list of what we allow and don't allow can be found <a href="https://docs.google.com/spreadsheets/d/1M4vXMxHcYwtstB6SD9r4lPFotUXhz3IL9D_3JX8tjyE/edit?gid=1204643762#gid=1204643762" target="_blank">here.</a></li>
                        <li>Your record must show the stats on the "Level Complete!" and stats endscreen (attempts, orbs, etc).</li>
                        <li>You may not use any skips that make any section of the level significantly easier.</li>
                        <li>A maximum of 2 keybinds are allowed per player.</li>
                        <li>If a level specifies a Method and/or FPS, you must follow those parameters. If left blank, any method or FPS setup is allowed. A list of all methods can be found <a href="https://docs.google.com/document/d/1PMr1f_CiVhmBbt4OWfdwy_V5_n1AS4zIqzdhFm1VdBg/edit?usp=sharing" target="_blank">here.</a></li>
                        <li>Changing your FPS mid-attempt is not allowed.</li>
                    
                    <h2>DEMONLIST RULES</h2>
                        <li>Video proof is required for <strong>Top 50 Demons.</strong></li>
                        <li>If your record is in the Top 3, you must have raw footage with isolated clicks, uploaded in a downloadable format (e.g. Google Drive) and submitted along with your public video.</li>
                    
                    <h2>PEMONLIST RULES</h2>
                        <li>Video proof is required for the <strong>Top 1 Pemon.</strong></li>

                    <h2>CHALLENGE LIST RULES</h2>
                        <li>Video proof is required for <strong>Top 40 Challenges.</strong></li>
                        <li>Levels can last up to 29 seconds.</li>
                        <li>Random Triggers are allowed as long as all outcomes are of equal difficulty. They may not affect the gameplay or visual difficulty.</li>
                        <li>Copying levels outside the GDPS is allowed as long as significant modifications are made to the gameplay or decoration. Direct copies or slightly edited versions are not allowed.</li>
                        <li>Reuploaded levels are allowed only if the host and verifier have joined the GDPS.</li>
                        <li>Reuploaded levels are judged more strictly to prevent low quality or joke levels from filling the list.</li>
                        <li>Reuploaded levels cannot be Top #1 difficulty.</li>
                        <li>Please avoid reuploading a large number of levels in a short period of time. Excessive submissions may be rejected or delayed.</li>
                    
                    <h2>UNRATED LIST RULES</h2>
                        <li>Video proof is required for <strong>Top 5 levels.</strong></li>
                        <li>Levels must be at least 30 seconds long.</li>
                        <li>Levels must be at least Easy Demon difficulty (GDPS standards).</li>
                        <li>Random Triggers are allowed as long as all outcomes are of equal difficulty. They may not affect the gameplay or visual difficulty.</li>
                        <li>Copying levels outside the GDPS is allowed as long as significant modifications are made to the gameplay or decoration. Direct copies or slightly edited versions are not allowed.</li>
                        <li>Reuploaded levels are allowed only if the host and verifier have joined the GDPS.</li>
                        <li>Reuploaded levels are judged more strictly to prevent low quality or joke levels from filling the list.</li>
                        <li>Reuploaded levels cannot be Top #1 difficulty.</li>
                        <li>Please avoid reuploading a large number of levels in a short period of time. Excessive submissions may be rejected or delayed.</li>
                </section>
            </template>
        </main>
    `,

    data: () => ({
        loading: true,
        editors: [],
    }),

    async mounted() {
        this.editors = await fetchEditors();
        this.loading = false;
    },
};
