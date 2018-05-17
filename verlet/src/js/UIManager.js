import Signal from 'signals';

export default class UIManager
{
    constructor()
    {

        this.onMenu = new Signal();

        this.menu = document.getElementById("menu");
        this.teamSection = document.getElementById("teamSection");
        this.art = document.getElementById("art");
        this.dev = document.getElementById("dev");
        this.titleAboutIt = document.getElementById("titleAboutIt");
        this.titleTeam = document.getElementById("titleTeam");
        this.description = document.getElementById("description");
        this.listArtists = document.getElementById("listArtists");
        this.listDevs = document.getElementById("listDevs");
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

        this.menu.addEventListener("click", ()=>{
            this.onMenu.dispatch();
        });
        this.menu.addEventListener("touchend", ()=>{
            this.onMenu.dispatch();
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


    slide(element, id, from, to, duration, delay, cb)
    {
        element.style.opacity = 0;
        element.style.top = from + 'px';
        TweenLite.to(id, duration,
        {
            delay: delay,
            top: to,
            ease: Sine.easeInOut
        });

        TweenLite.to(id, duration/2,
        {
            scaleY: 3,
            delay: delay,
            ease: Circ.easeIn,
            onComplete: ()=>{
                TweenLite.to(id, duration/2,
                {
                    scaleY: 1,
                    ease: Circ.easeOut
                });
            }
        });

        TweenLite.to(id, duration/2,
        {
            delay: duration/3 + delay,
            opacity: 1,
            ease: Circ.easeOut,
            onComplete: ()=>{
                if(cb) cb();
            }
        });
    }

    showAbout()
    {

        if(this.aboutDisplayed) return;

        this.art.style.opacity = 0;
        this.dev.style.opacity = 0;
        this.description.style.opacity = 0;

        this.slide(this.titleAboutIt, "#titleAboutIt", 60, 0, .4, .1,
        ()=>{
            TweenLite.to("#description", .3, {
                opacity: 1
            });
        });
        this.slide(this.titleTeam, "#titleTeam", 60, 0, .4, .4,
        ()=>{
            TweenLite.to(["#dev", "#art"], .3, {
                opacity: 1
            });
        });


        this.aboutScreen.style.display= 'block';
        this.aboutDisplayed = true;

        // hide panel

        TweenLite.to("#aboutSlideIn", .4, {
            top: "0%",
            ease: Circ.easeInOut
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

        this.description.innerHTML = data.description;
        let team = data.team;
        if(team.art.length === 0 && team.dev.length === 0)
        {
            // hide team section
            this.teamSection.style.display = 'none';
        }
        else {
            this.teamSection.style.display = 'block';
            // show team section
            let ulContentArt = '';
            for (var i = 0; i < team.art.length; i++) {
                ulContentArt += '<li>' + team.art[i] + '</li>';
            }

            if(team.art.length === 0)
            {
                ulContentArt = '<li>N/A</li>';
            }

            let ulContentDev = '';
            for (var i = 0; i < team.dev.length; i++) {
                ulContentDev += '<li>' + team.dev[i] + '</li>';
            }
            if(team.dev.length === 0)
            {
                ulContentDev = '<li>N/A</li>';
            }

            this.listArtists.innerHTML = ulContentArt;
            this.listDevs.innerHTML = ulContentDev;
        }
    }

    showTitle(title)
    {
        // this.date.style.marginTop = "-100px";
        // this.producerName.style.marginTop = "-100px";
        // this.client.style.marginTop = "-100px";
        this.container.style.display = "block";
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
            this.container.style.display = "none";
            // this.client.style.marginTop = "-100px";


        }

        this.buttonProject.style.opacity = 0;

        this.hideAbout();

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
            ease: Circ.easeOut,
            onComplete: ()=>{
                this.container.style.display = "none";
            }
        });
    }

    onHover()
    {
        // TweenLite.to("#containerTitle", 1, {
        //     scaleY: .9,
        //     ease: Back.easeOut.config(1.2)
        // });
        //
        // TweenLite.to("#titleProject", 1, {
        //     letterSpacing: 10,
        //     autoRound:false,
        //     ease: Back.easeOut.config(1.2)
        // });
    }

    onOut()
    {
        // TweenLite.to("#containerTitle", .6, {
        //     scaleY: 1,
        //     ease: Back.easeOut.config(1.2)
        // });
        //
        // TweenLite.to("#titleProject", .6, {
        //     letterSpacing: 6,
        //     autoRound:false,
        //     ease: Back.easeOut.config(1.2)
        // });
    }
}
