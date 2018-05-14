
export default class UIManager
{
    constructor()
    {
        this.container = document.getElementById("overlay");
        this.title = document.getElementById("titleProject");

        this.date = document.getElementById("date");
        this.producerName = document.getElementById("producerName");
        this.client = document.getElementById("client");

        this.aboutLink = document.getElementById("link");

        // TweenLite.to("#containerTitle", 1, {
        //     opacity: 1,
        //     y: 0,
        //     ease: Back.easeOut.config(1.2)
        // });

        this.aboutLink.addEventListener("click", ()=>{
            this.showAbout();
        });
        this.aboutLink.addEventListener("touchend", ()=>{
            this.showAbout();
        });

        this.title.addEventListener("mouseenter", ()=>{
            this.onHover();
        });

        this.title.addEventListener("mouseleave", ()=>{
            this.onOut();
        });

        this.hideTitle(true);
    }

    showAbout()
    {

        if(this.aboutDisplayed) return;

        this.aboutDisplayed = true;

        // hide panel

        TweenLite.to("#aboutSlideIn", .2, {
            top: "0%"
        });

        TweenLite.to("#link", .2, {
            opacity: 0
        });

        TweenLite.to("#about", .4, {
            delay: .2,
            height: 0
        });



    }

    setData(data)
    {
        this.title.innerHTML = data.title;
        this.date.innerHTML = data.date;
        this.producerName.innerHTML = data.producer;
        this.client.innerHTML = data.client;
    }

    showTitle(title)
    {
        // this.date.style.marginTop = "-100px";
        // this.producerName.style.marginTop = "-100px";
        // this.client.style.marginTop = "-100px";



        TweenLite.to("#producerName", .4,
        {
            delay: 1,
            onStart: ()=>{
                this.container.style.opacity = 1;
            },
            opacity: 1
        });
        TweenLite.to("#date", .8,
        {
            delay: 1,
            marginTop: 0,
            ease: Back.easeOut.config(2)
        });
        TweenLite.to("#client", 1,
        {
            delay: 1,
            marginTop: 0,
            ease: Back.easeOut.config(2)
        });

        // TweenLite.fromTo("#containerTitle", .5,
        // {
        //     opacity: 0,
        //     y: -100
        // },
        // {
        //     opacity: 1,
        //     y: -10,
        //     ease: Circ.easeOut
        // });
    }

    hideTitle(snap)
    {
        if(snap)
        {
            this.container.style.opacity = 0;

            // return;
            this.date.style.marginTop = "-100px";
            this.producerName.style.opacity = 0;
            this.client.style.marginTop = "-100px";


        }

        TweenLite.to("#overlay", .5, {
            opacity: 0,
            ease: Circ.easeOut
        });
    }

    onHover()
    {
        TweenLite.to("#containerTitle", 1, {
            scaleY: .9,
            ease: Back.easeOut.config(1.2)
        });

        TweenLite.to("#title", 1, {
            letterSpacing: 10,
            autoRound:false,
            ease: Back.easeOut.config(1.2)
        });
    }

    onOut()
    {
        TweenLite.to("#containerTitle", .6, {
            scaleY: 1,
            ease: Back.easeOut.config(1.2)
        });

        TweenLite.to("#title", .6, {
            letterSpacing: 0,
            autoRound:false,
            ease: Back.easeOut.config(1.2)
        });
    }
}
