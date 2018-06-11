//'use strict';

/* global Util, Repository, Contributor */

class App {
    constructor(url) {
        this.initialize(url);
    }

    /**
     * Initialization
     * @param {string} url The GitHub URL for obtaining the organization's repositories.
     */
    async initialize(url) {
        // Add code here to initialize your app
        // 1. Create the fixed HTML elements of your page
        // 2. Make an initial XMLHttpRequest using Util.fetchJSON() to populate your <select> element

        const root = document.getElementById('root');
        // ...

        try {
            // ...
            const repos = await Util.fetchJSON(url);

            console.log(repos);

            this.repos = repos.map(repo => new Repository(repo));
            // ...
        } catch (error) {
            this.renderError(error);
        }
    }

    /**
     * Fetch contributor information for the selected repository and render the
     * repo and its contributors as HTML elements in the DOM.
     * @param {number} repoId The array index of the repository.
     */
    async fetchContributorsAndRender(repoId) {
        try {

            this.showRepositoriesInSelect(this.repos);

            const repo = this.repos.find(repository => {
                return repository.id === Number.parseInt(repoId);
            });
            console.log(repo);

            //const repo = this.repos[index];

            const contributors = await repo.fetchContributors();

            const container = document.getElementById('container');
            // Erase previously generated inner HTML from the container div
            container.innerHTML = '';

            const leftDiv = Util.createAndAppend('div', container);
            const rightDiv = Util.createAndAppend('div', container);

            const contributorList = Util.createAndAppend('ul', rightDiv);



            repo.render(leftDiv);

            contributors
                .map(contributor => new Contributor(contributor))
                .forEach(contributor => contributor.render(contributorList));
        } catch (error) {
            this.renderError(error);
        }
    }

    /**
     * Shows (renders to the DOM) all repositories in a select element.
     * 
     * @param {Array} repositories 
     */

    showRepositoriesInSelect(repositories) {
        const repositoriesSelectElement = document.querySelector("#repositories");

        repositoriesSelectElement.setAttribute(
            "onchange", "this.fetchContributorsAndRender(this.value)"
        );

        repositories.forEach(repository => {
            const optionElement = document.createElement("option");
            optionElement.setAttribute("value", repository.id);
            optionElement.innerText = repository.name;

            repositoriesSelectElement.appendChild(optionElement);
        });
    }


    /**
     * Render an error to the DOM.
     * @param {Error} error An Error object describing the error.
     */
    renderError(error) {
        // Replace this comment with your code
        console.log("You are not able to render", error);
    }
}

const HYF_REPOS_URL = 'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';

window.onload = () => new App(HYF_REPOS_URL);