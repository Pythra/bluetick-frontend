
        .bottom-navigation-addon-fade-in {
        opacity: 1;
        animation-name: fadeInOpacityx;
        animation-iteration-count: 1;
        animation-timing-function: ease-in;
        animation-duration: 2s;
        }

        @keyframes fadeInOpacityx {
        0% {
        opacity: 0;
        }
        30% {
        opacity: 0.6;
        }
        50% {
        opacity: 0.9;
        }
        100% {
        opacity: 1;
        }
        }

        .bottom-navigation-addon-wrapper{

        }

        .bottom-navigation-addon-container {
        z-index: 17;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        }

        .bottom-navigation-addon-hidden{
            display: none !important;
        }

        .bottom-navigation-addon-button{
            display: inline-block;
            width: 80px;
            margin: 3px;
            height: 80px;
            padding: 9px 0;
            background: rgba(22, 22, 22, 0.95);

            cursor: pointer;
            pointer-events: auto;
            text-align: center;
        }

        .bottom-navigation-addon-button i {
            color: rgba(255, 255, 255, 0.9);
            font-size: 3.5em;
            pointer-events: none;
            transition: color 0.2s
            ease-in-out;
            text-decoration: none;
        }

        .bottom-navigation {
        position: fixed;
        right: calc(50vw + 25px);
        bottom: 45px;
        z-index: 17; /*also change in drct*/
        }

        .bottom-navigation .navigation-bars {
        bottom: 0px;
        position: absolute;
        display: block;
        width: 50px;
        height: 50px;
        background: rgba(255, 255, 255, 0.15);
        cursor: pointer;
        color: rgba(255, 255, 255, 0.5);
        text-align: center;
        line-height: 50px;
        font-size: 1.5em;
        box-shadow: 0 10px 20px rgba(0, 0, 0, 0.19), 0 6px 6px rgba(0, 0, 0, 0.23);
        transition: background 0.4s, color 0.5s;
        }

        .bottom-navigation .navigation-bars:hover {
        background: rgba(255, 255, 255, 0.3);
        transition: background 0.4s, color 0.5s;
        color: #fff;
        }

        .bottom-navigation .navigation-bars:active {
        background: rgba(255, 255, 255, 0.3);
        transition: background 0.4s, color 0.5s;
        color: #fff;
        color: rgb(26, 26, 26);
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
        transition: box-shadow 0.3s;
        }

        .bottom-navigation ul {
        top: 250px;
        opacity: 0;
        bottom: 60px;
        position: absolute;
        transition: opacity 0.3s ease-in-out;
        }

                    .bottom-navigation ul li:nth-child(1) {
            transform: translate(-70.710678118655px, 70.710678118655px);
            }
                        .bottom-navigation ul li:nth-child(2) {
            transform: translate(-100px, -1.2246467991474E-14px);
            }
                        .bottom-navigation ul li:nth-child(3) {
            transform: translate(-70.710678118655px, -70.710678118655px);
            }
                        .bottom-navigation ul li:nth-child(4) {
            transform: translate(6.1232339957368E-15px, -100px);
            }
                        .bottom-navigation ul li:nth-child(5) {
            transform: translate(70.710678118655px, -70.710678118655px);
            }
                        .bottom-navigation ul li:nth-child(6) {
            transform: translate(100px, -0px);
            }
            
        .bottom-navigation ul li {
        position: absolute;
        display: block;
        width: 55px;
        height: 55px;
        background: rgba(22, 22, 22, 0.95);
        border-radius: 50%;
        cursor: pointer;
        pointer-events: auto;
        text-align: center;
        font-size: 1em;
        line-height: 63px;
        transition: transform 0.5s ease-in-out;




        }


        .bottom-navigation ul li i {
        color: rgba(255, 255, 255, 0.9);
        font-size: 1.5em;
        pointer-events: none;
        transition: color 0.2s ease-in-out;
        text-decoration: none;
        }

        .bottom-navigation ul li:hover {
        background: rgba(255, 255, 255, 0.6);
        transition: background 0.4s;
        }

        .bottom-navigation ul li:hover i {
        color: rgba(255, 255, 255, 1);
        transition: color 0.2s ease-in-out;
        }

        .bottom-navigation ul li:active {
        background: rgba(255, 255, 255, 0.3);
        transition: background 0.4s;
        }

        .bottom-navigation ul li:active i {
        color: rgb(26, 26, 26);
        transition: color 0.2s ease-in-out;
        }

        .bottom-navigation.active ul {

        background: linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0));
        backdrop-filter: blur(10px);
        -webkit-backdrop-filter: blur(10px);
        box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);

        top: initial;
        opacity: 1;
        transition: opacity 0.7s 0.1s;
        }

                    .bottom-navigation.active ul li:nth-child(1) {
            transform: translate(-100px, -1.2246467991474E-14px);
            }
                        .bottom-navigation.active ul li:nth-child(2) {
            transform: translate(-70.710678118655px, -70.710678118655px);
            }
                        .bottom-navigation.active ul li:nth-child(3) {
            transform: translate(6.1232339957368E-15px, -100px);
            }
                        .bottom-navigation.active ul li:nth-child(4) {
            transform: translate(70.710678118655px, -70.710678118655px);
            }
                        .bottom-navigation.active ul li:nth-child(5) {
            transform: translate(100px, -0px);
            }
                        .bottom-navigation.active ul li:nth-child(6) {
            transform: translate(70.710678118655px, 70.710678118655px);
            }
            
        .bottom-navigation.active ul li {
        transition: transform 0.83s, background 0.4s, box-shadow 0.2s;
        /*box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);*/


        -webkit-box-shadow: 0px 0px 20px 0px rgba(255, 255, 255, 0.9);
        -moz-box-shadow: 0px 0px 20px 0px rgba(255, 255, 255, 0.9);
        box-shadow: 0px 0px 20px 0px rgba(255, 255, 255, 0.9);



        }

        .bottom-navigation.active ul li:active {
        box-shadow: none;
        transition: box-shadow 0.2s;
        }
        