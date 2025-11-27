document.addEventListener('DOMContentLoaded', function () {
    const check1 = document.getElementById('check_1');
    const check2 = document.getElementById('check_2');
    const input = document.getElementById('text_1');
    const label = document.getElementById('label_2');
    const submitBtn = document.getElementById('submit_bottom');
    const responseEl = document.getElementById('response_area');
    const API_Key = 'UGJtbvpg+1Mi+pNMG+B5uQ==UfOJK7Pih9ZmlAln';

    if (!check1 || !check2 || !input || !label || !submitBtn || !responseEl) {
        return;
    }

    function clearUI() {
        responseEl.textContent = '';
    }

    function makeExclusive(clicked, other) {
        if (clicked.checked) {
            other.checked = false;
        }
        clearUI();
    }

    check1.addEventListener('change', function () {
        makeExclusive(check1, check2);
        input.disabled = false;
        input.placeholder = 'e.g. US';
        label.textContent = 'Enter country code (e.g. AU, US)';
    });

    check2.addEventListener('change', function () {
        makeExclusive(check2, check1);
        input.disabled = false;
        input.placeholder = 'e.g. 1';
        label.textContent = 'Select the number of Dad Joke';
    });

    submitBtn.addEventListener('click', function (e) {
        e.preventDefault();
        clearUI();

        if (!check1.checked && !check2.checked) {
            responseEl.textContent = 'Please select an option first.';
            return;
        }

        if (check1.checked) {
            var country = (input.value || 'AU').trim();
            var url = 'https://api.api-ninjas.com/v1/publicholidays?country=' + encodeURIComponent(country);

            responseEl.textContent = 'Loading all public holidays…';

            fetch(url, {
                method: 'GET',
                headers: { 'X-Api-Key': API_Key }
            })
                .then(function (res) {
                    if (!res.ok) {
                        return res.text().then(function (text) {
                            throw new Error('HTTP ' + res.status + ': ' + text);
                        });
                    }
                    return res.json();
                })
                .then(function (data) {
                    if (!Array.isArray(data) || data.length === 0) {
                        responseEl.textContent = 'No public holidays found for ' + country + '.';
                        return;
                    }

                    data.sort(function (a, b) {
                        return new Date(a.date) - new Date(b.date);
                    });

                    var items = data.map(function (h) {
                        var regionText = 'National';

                        if (Array.isArray(h.regions)) {
                            if (h.regions.length > 0) {
                                if (h.regions.length === 1 && h.regions[0].toLowerCase() === 'all') {
                                    regionText = 'National';
                                } else {
                                    regionText = h.regions.join(', ');
                                }
                            }
                        } else if (typeof h.regions === 'string') {
                            regionText = h.regions.toLowerCase() === 'all' ? 'National' : h.regions;
                        }

                        return '<li><strong>' + h.date + '</strong> — ' + h.name + ' <small>(' + regionText + ')</small></li>';
                    }).join('');

                    responseEl.innerHTML =
                        '<strong>All Public Holidays in ' + country +
                        ' (Current Year):</strong>' +
                        '<ul style="margin:.5rem 0 0 1.2rem;">' + items + '</ul>';
                })
                .catch(function (err) {
                    responseEl.textContent = 'Error fetching holidays: ' + err.message;
                });
        }

        if (check2.checked) {
            const joke_number = input.value.trim();
            responseEl.textContent = '';

            try {
                if (joke_number === '') {
                    responseEl.innerHTML = '<span style="color:red; font-size:1.3rem;">Input is empty.</span>';
                    return;
                }

                if (isNaN(joke_number)) {
                    responseEl.innerHTML = '<span style="color:red; font-size:1.3rem;">Input is not a number.</span>';
                    return;
                }

                const num = Number(joke_number);

                if (num !== 1) throw 'You need a premium account for more than one joke';

                responseEl.textContent = 'Loading dad joke…';

                fetch('https://api.api-ninjas.com/v1/dadjokes', {
                    method: 'GET',
                    headers: { 'X-Api-Key': API_Key }
                })
                    .then(function (res) {
                        if (!res.ok) {
                            return res.text().then(function (text) {
                                throw new Error('HTTP ' + res.status + ': ' + text);
                            });
                        }
                        return res.json();
                    })
                    .then(function (data) {
                        const joke = (data && data.length > 0 && data[0].joke) ? data[0].joke : 'No joke found — try again!';
                        responseEl.innerHTML = '<strong>Dad Joke:</strong> ' + joke;
                    })
                    .catch(function (err) {
                        responseEl.textContent = 'Error fetching joke: ' + err.message;
                    });
            } catch (err) {
                responseEl.textContent = err;
            }
        }
    });
});
