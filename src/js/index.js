const getData = () => {
    const input = document.getElementById('input');

    const titleStats = document.getElementById('titleStats');
    const aboutCity = document.getElementById('aboutCity');

    const typeError = document.getElementById('typeError');

    // lower case input value
    let inputV = input.value.toLowerCase();

    // replace the space with dash
    let finalInput = inputV.replace(' ', '-');

    //array fot chart
    let nameArr = [];
    let scoreArr = [];
    let colorArr = [];


    //api call
    axios.get(`https://api.teleport.org/api/urban_areas/slug:${finalInput}/scores/`)
        .then(response => {

            const data = response.data;
            let category = data.categories;

            //data cicle
            for (let i = 0; i < 17; i++) {

                //push data to array
                nameArr.push(category[i].name);
                scoreArr.push(category[i].score_out_of_10.toFixed(1));
                colorArr.push(category[i].color);
            }
            //array fot chart


            //info city
            let citySummary = data.summary;

            //inner info city
            titleStats.innerHTML = 'About the city:';
            aboutCity.innerHTML = citySummary;

            //reset input value
            input.value = '';

            // reset error text
            typeError.style.display = 'none'

            //scroll
            window.scrollTo(0, document.body.scrollHeight);

            //start chart
            const ctx = document.getElementById('chartBox');
            ctx.innerHTML = '<canvas id="myChart"></canvas>';


            const chart = new Chart("myChart", {
                type: 'bar',
                data: {
                    labels: nameArr,
                    datasets: [{
                        label: 'City Score',
                        data: scoreArr,
                        borderWidth: 1,
                        backgroundColor: colorArr,
                    }],

                },
                options: {
                    indexAxis: 'y',
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: false
                        },
                        tooltip: {
                            enabled: true
                        },
                        scales: {
                            y: {
                                beginAtZero: true
                            }
                        }
                    }
                }

            });

            chart.update();
        })
        //error
        .catch(error => {
            console.error(error);
            //type error
            typeError.style.display = 'block'
            //reset input value
            input.value = '';

        });
}

window.onload = function () {
    const buttonSearch = document.getElementById('buttonSearch');
    const input = document.getElementById('input');


    buttonSearch.addEventListener('click', () => {
        getData();
    })


    input.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            getData();
        };
    });

}
