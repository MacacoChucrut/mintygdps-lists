export default {
    computed: {
    currentList() {
        return this.$route.params.listName || "demonlist";
    },

    headerTitle() {
        const route = this.$route;
        if (route.path === "/")
            return "HOME";

        switch (route.params.listName) {
            case "demonlist":
                return "DEMONLIST";

            case "pemonlist":
                return "PEMONLIST";

            case "challengelist":
                return "CHALLENGE LIST";

            case "unratedlist":
                return "UNRATED LIST";

            default:
                return "BRO WHAT ARE YOU DOING";
        }
    },
},

    template: `
        <header>
            <router-link to="/" class="header-brand">
                <img src="/list_icon.png">
                <h1>{{ headerTitle }}</h1>
            </router-link>

            <nav class="header-buttons">

                <div class="dropdown">
                    <button class="dropbtn">
                        LISTS ▼
                    </button>

                    <div class="dropdown-content">
                        <router-link to="/demonlist">
                            DEMONLIST
                        </router-link>

                        <router-link to="/pemonlist">
                            PEMONLIST
                        </router-link>

                        <router-link to="/challengelist">
                            CHALLENGE LIST
                        </router-link>

                        <router-link to="/unratedlist">
                            UNRATED LIST
                        </router-link>
                    </div>
                </div>

                <router-link :to="\`/\${currentList}/packs\`">
                    PACKS
                </router-link>

                <router-link :to="\`/\${currentList}/leaderboard\`">
                    LEADERBOARD
                </router-link>

                <router-link :to="\`/\${currentList}/roulette\`">
                    ROULETTE
                </router-link>

            </nav>
        </header>
    `
}