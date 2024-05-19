class responseData {
    constructor(owner, repo) {
        this.owner = owner;
        this.repo = repo;
    }

     async getLanguages(owner, repo) {
        const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/languages`);
        const languages = await response.json();
        return languages;
      }

    async getTopTenContributors(owner, repo) {
        const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/contributors`);
        const topContributorsFirstPage = await response.json();
        const topTenContributors = topContributorsFirstPage.slice(0, 10);
        return topTenContributors;
      }
      async getStargazersAndForks(owner, repo) {
        const response = await fetch(`https://api.github.com/repos/${owner}/${repo}`);
        const fullData = await response.json();
        const forks_count = fullData.forks_count;
        const stargazers_count = fullData.stargazers_count;
        return {stargazers_count, forks_count};
      }
}

const gettingData = new responseData;


  (async () => {
   console.log(await gettingData.getStargazersAndForks("apache", "flink"))
  })();