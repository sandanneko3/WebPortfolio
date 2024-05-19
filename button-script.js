document.getElementById("profile_button").addEventListener("click", function(){
    var content = document.getElementById("details");
    if (content.classList.contains("hidden")){
        content.classList.remove("hidden");
    }else{
        content.classList.add("hidden");
    }
});