
export default class UIManager
{
    constructor()
    {
        this.container = document.getElementById("overlay");
        this.aboutScreen = document.getElementById("aboutScreen");
        this.about = document.getElementById("buttonAbout");
        this.title = document.getElementById("titleProject");
        this.buttonProject = document.getElementById("insideButtonProject");

        this.top = document.getElementsByClassName("top")[0];

        this.date = document.getElementById("date");
        this.producerName = document.getElementById("producerName");
        this.client = document.getElementById("client");

        this.aboutLink = document.getElementById("link");
        this.aboutBack = document.getElementById("aboutBack");

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

        this.aboutBack.addEventListener("click", ()=>{
            this.hideAbout();
        });
        this.aboutBack.addEventListener("touchend", ()=>{
            this.hideAbout();
        });

        this.container.addEventListener("mouseenter", ()=>{
            this.onHover();
        });

        this.container.addEventListener("mouseleave", ()=>{
            this.onOut();
        });

        this.hideTitle(true);
    }

    hideAbout()
    {
        if(!this.aboutDisplayed) return;

        this.aboutDisplayed = false;

        TweenLite.to("#aboutSlideIn", .4, {
            top: "100%",
            ease: Circ.easeOut,
            onComplete: ()=>{
                this.aboutScreen.style.display= 'none';
            }
        });

        TweenLite.to("#link", .2, {
            opacity: 1
        });

        TweenLite.to("#buttonAbout", .4, {
            delay: .2,
            top: 0,
            ease: Circ.easeOut
        });
    }

    showAbout()
    {

        if(this.aboutDisplayed) return;

        this.aboutScreen.style.display= 'block';
        this.aboutDisplayed = true;

        // hide panel

        TweenLite.to("#aboutSlideIn", .4, {
            top: "0%",
            ease: Circ.easeOut
        });

        TweenLite.to("#link", .2, {
            opacity: 0
        });

        TweenLite.to("#buttonAbout", .4, {
            delay: .2,
            top: -40,
            ease: Circ.easeOut
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
        this.top.style.width = 0;
        this.container.style.opacity = 1;
        this.producerName.style.opacity = 0;
        this.title.style.opacity = 0;
        this.title.style.top = '-60px';
        this.date.style.left = "-100px";
        this.client.style.right = "-100px";
        this.about.style.top = "-80px";
        this.aboutLink.style.opacity = 1;

        this.buttonProject.style.opacity = 0;
        // this.buttonProject.style.top = '-60px';



        setTimeout(()=>{

            TweenLite.to(".top", .4, {
                width: '90%',
                ease: Circ.easeOut
            });

            TweenLite.to("#producerName", .4,
            {
                delay: .4,
                opacity: 1
            });
            TweenLite.to("#date", .6,
            {
                delay: .4,
                left: 0,
                ease: Back.easeOut.config(2)
            });
            TweenLite.to("#client", .6,
            {
                delay: .4,
                right: 0,
                ease: Back.easeOut.config(2)
            });

            TweenLite.to("#titleProject", .8,
            {
                delay: .1,
                top: 40,
                ease: Circ.easeInOut
            });

            TweenLite.to("#titleProject", .4,
            {
                delay: .1,
                scaleY: 3,
                ease: Circ.easeIn,
                onComplete: ()=>{
                    TweenLite.to("#titleProject", .4,
                    {
                        scaleY: 1,
                        ease: Circ.easeOut
                    });
                }
            });

            TweenLite.to("#titleProject", .4,
            {
                delay: .5,
                opacity: 1,
                ease: Circ.easeOut
            });

            TweenLite.to("#buttonAbout", .4,
            {
                delay: .2,
                top: 0,
                ease: Circ.easeOut
            });

            TweenLite.to("#insideButtonProject", .2,
            {
                delay: .3,
                opacity: 1
            });

        }, 500)

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
            // this.date.style.marginTop = "-100px";
            this.producerName.style.opacity = 0;
            // this.client.style.marginTop = "-100px";


        }

        // TweenLite.to(".top", .01, {
        //     width: 0,
        //     ease: Circ.easeOut
        // });

        this.container.style.opacity = 0;
        // return;
        // this.date.style.marginTop = "-100px";
        // this.client.style.marginTop = "-100px";


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

        TweenLite.to("#titleProject", 1, {
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

        TweenLite.to("#titleProject", .6, {
            letterSpacing: 6,
            autoRound:false,
            ease: Back.easeOut.config(1.2)
        });
    }
}
