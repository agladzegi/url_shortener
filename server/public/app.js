const form = document.querySelector('#urlForm');
const loading = document.querySelector('#loading');
const input = document.querySelector('#url');
const showUrl = document.querySelector('#showUrl');

form.addEventListener('submit', async function (e) {
  e.preventDefault();

  showUrl.innerHTML = '';
  loading.style.display = 'block';
  const res = await fetch('/url', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify({ url: input.value }),
  });

  const result = await res.json();

  if (result.message) {
    const p = document.createElement('p');
    const text = document.createTextNode(result.message);
    p.appendChild(text);
    showUrl.append(p);
    setTimeout(() => {
      showUrl.removeChild(p);
    }, 3000);
  } else {
    const urlResult = document.createElement('input');
    urlResult.type = 'text';
    urlResult.setAttribute('id', 'urlResult');
    urlResult.readOnly = true;
    urlResult.value = `${window.location.protocol}//${window.location.host}/${result.slug}`;
    showUrl.append(urlResult);

    const resultBtn = document.createElement('button');
    resultBtn.type = 'button';
    resultBtn.setAttribute('id', 'resultBtn');
    resultBtn.innerHTML = `<img src="./copy.svg" alt="Copy" /> დააკოპირე`;
    resultBtn.addEventListener('click', function () {
      window.getSelection().removeAllRanges();
      urlResult.readOnly = false;
      urlResult.select();
      urlResult.setSelectionRange(0, 99999);
      document.execCommand('copy');
      window.getSelection().removeAllRanges();
      urlResult.readOnly = true;
      resultBtn.innerHTML = `<img src="./copy.svg" alt="Copy" /> დაკოპირდა`;
    });
    showUrl.append(resultBtn);
  }

  input.value = '';
  loading.style.display = 'none';
});
