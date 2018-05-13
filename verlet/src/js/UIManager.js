
export default class UIManager
{
    constructor()
    {
        this.container = document.getElementById("containerTitle");
        this.title = document.getElementById("title");

        // TweenLite.to("#containerTitle", 1, {
        //     opacity: 1,
        //     y: 0,
        //     ease: Back.easeOut.config(1.2)
        // });

        this.title.addEventListener("mouseenter", ()=>{
            this.onHover();
        });

        this.title.addEventListener("mouseleave", ()=>{
            this.onOut();
        });

        this.hideTitle(true);
    }

    showTitle(title)
    {
        this.title.innerHTML = title;

        TweenLite.fromTo("#containerTitle", .5,
        {
            opacity: 0,
            y: -100
        },
        {
            opacity: 1,
            y: -10,
            ease: Circ.easeOut
        });
    }

    hideTitle(snap)
    {
        if(snap)
        {
            this.container.style.opacity = 0;

            // return;
        }
        TweenLite.to("#containerTitle", .5, {
            opacity: 0,
            y: 100,
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
