
export default class UIManager
{
    constructor()
    {
        this.container = document.getElementById("containerTitle");
        this.text = document.getElementById("test");

        // TweenLite.to("#containerTitle", 1, {
        //     opacity: 1,
        //     y: 0,
        //     ease: Back.easeOut.config(1.2)
        // });

        // text.addEventListener("mouseenter", ()=>{

        // });

        // text.addEventListener("mouseleave", ()=>{
            // TweenLite.to("#containerTitle", .6, {
            //     scaleY: 1,
            //     ease: Back.easeOut.config(1.2)
            // });
            //
            // TweenLite.to("#test", .6, {
            //     letterSpacing: 2,
            //     autoRound:false,
            //     ease: Back.easeOut.config(1.2)
            // });
        // });
    }

    showTitle(title)
    {
    }

    hideTitle()
    {
    }

    onHover(title)
    {
        TweenLite.to("#containerTitle", 1, {
            scaleY: .9,
            ease: Back.easeOut.config(1.2)
        });

        TweenLite.to("#test", 1, {
            letterSpacing: 12,
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

        TweenLite.to("#test", .6, {
            letterSpacing: 2,
            autoRound:false,
            ease: Back.easeOut.config(1.2)
        });
    }
}
