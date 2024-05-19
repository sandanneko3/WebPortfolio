document.getElementById("artifact_button").addEventListener("click", function(){
    var content = document.getElementById("artifact");
    if (content.classList.contains("hidden")){
        content.classList.remove("hidden");
    }else{
        content.classList.add("hidden");
    }
});