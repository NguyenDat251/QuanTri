var feedback = function(res) {
    if (res.success === true) {
        var get_link = res.data.link.replace(/^http:\/\//i, 'https://');
        document.querySelector('.status').classList.add('bg-success');
        // document.querySelector('.status').innerHTML =
        //
        //     'Image : ' + '<br><input class="image-url" value=\"' + get_link + '\"/>' + '<img class="img" alt="Imgur-Upload" src=\"' + get_link + '\"/>';
        document.getElementById('inputLink1').placeholder = get_link;
    }
};

new Imgur1({
    clientid: '4409588f10776f7', //You can change this ClientID
    callback: feedback
});