var view ={
    createOptions: function(){
        // document.body.style.zoom = "200%";
        var main = document.getElementById("gameBoard");
        main.innerHTML = `
        <table>
            <tr>
                <td id = "one"> ${model.boardSizes[0]} x ${model.boardSizes[0]} </td>
                <td id = "two" > ${model.boardSizes[1]} x ${model.boardSizes[1]} </td>
                <td id = "three" > ${model.boardSizes[2]} x ${model.boardSizes[2]} </td>
            </tr>
        </table>`;

        var col = document.getElementsByTagName("td");
        for(var i = 0; i < col.length; i++){
            col[i].onclick = this.createBoard;
        }

    },

    createBoard : function(eventObj){
        var options = ["one", "two", "three"];
        var size = options.indexOf(eventObj.target.id);
        model.currentBoardSize = model.boardSizes[size];
       
        // if(size == 1){
        //     document.body.style.zoom = "150%";
        // }

        // if(size == 2){
        //     document.body.style.zoom = "120%";
        // }

        var boardSizes = model.boardSizes;

        var board = "<table>";
        

        for(var i = 0; i < boardSizes[size]; i++){
            var row = "<tr>";

            for(var j = 0; j < boardSizes[size]; j++){
                row += `<td id='${i+""+j}'></td>`;
            }

            row += "</tr>";
            board += row;
        }

        board += "</table>";
        var main = document.getElementById('gameBoard');
        main.innerHTML = board;

        var columns = document.getElementsByTagName('td');
        for(var i = 0; i < columns.length; i++){
            columns[i].style.setProperty('height', '50px', 'important');
            columns[i].style.setProperty('width', '50px', 'important');
            columns[i].onclick = view.revealCard;
        }

        view.showScoreboard(1);
        model.currentTableBuilder();
        
    },

    backToMenu: function(){
        model.currentPlayer = 1;
        model.currentTable = [];
        model.player1Score = 0;
        model.player2Score = 0;
        model.totalCardsFlipped = 0;
        model.numberOfCardsFlipped = 0;
        view.showMsg(-1);
        view.updateScore(1);
        view.updateScore(2);

        controller.startGame();
        view.showScoreboard(0);
    },

    revealCard: function(eventObj){
        var cardID = eventObj.target.id;
        var card = document.getElementById(cardID);
        
        var x = Number(cardID.charAt(0));
        var y = Number(cardID.charAt(1));
        card.style.backgroundImage = `url('images/${model.currentTable[Number(cardID.charAt(0))][Number(cardID.charAt(1))]}')`;
        card.style.backgroundRepeat = "no-repeat";
        card.style.backgroundSize = "contain";
        card.style.backgroundColor = "powderblue";
        card.style.borderStyle = "solid";
        card.style.borderColor = "black";
        card.style.borderRadius = "5%";
        card.style.borderColor = "#035E7B";
        
        model.currentCards.push(cardID);
        controller.takeTurn();
    },

    closeCard: function(card){
        card.style.backgroundImage = "none";
        card.style.backgroundRepeat = "none";
        card.style.backgroundSize = "none";
        card.style.backgroundColor = "#035E7B";
        card.style.borderColor = "none";
        card.style.borderStyle = "none";
        card.style.borderRadius = "none";
    },

    showMsg: function(winner){
        var msgBox = document.getElementById("msgBox");
        msgBox.style.display = "block";
        if(winner == 0){
            msgBox.innerHTML = `
            <h5> Draw !! </h5>
            `;
        }

        if(winner == -1){
            msgBox.style.display = "none";
        }
        msgBox.innerHTML = `
        <h5> The winner is Player ${winner}</h5>
        `;
    },

    showScoreboard: function(state){
        var scoreboard = document.getElementById("scoreBoard");
        if(state == 1){
            scoreboard.style.display = "block";
        }else{
            scoreboard.style.display = "none";
        }
    },

    updateScore: function(player){
        var score = document.getElementById("score1");
        var score2 = document.getElementById("score2");

        if(player == 1){
            score.innerHTML = `<p style="font-size:10px">Player 1 Score: ${model.player1Score}</p>`;
            console.log(model.currentPlayer + "<<<<<");
            if(model.currentPlayer == 2){
                setTimeout(()=>{
                    score.style.borderStyle = "none";
                    score2.style.borderStyle = "solid";
                }, 1000);
                
            }
            return;
        }

        score2.innerHTML = `<p style="font-size:10px">Player 2 Score: ${model.player2Score}</p>`;
        if(model.currentPlayer == 1){
            setTimeout(()=>{
                score2.style.borderStyle = "none";
                score.style.borderStyle = "solid";
            }, 1000);
            
        }
        
    }
}

var model = {
    boardSizes: [4, 6, 8],
    currentBoardSize: 0,
    currentTable: [],

    currentCards : [],
    currentPlayer: 1,

    player1Score: 0,
    player2Score: 0,

    totalCardsFlipped: 0,
    numberOfCardsFlipped: 0,

    currentTableBuilder: function(){
        var table = [];
        
        for(var i = 0; i < this.currentBoardSize; i++){
            var row = [];
            for(var j = 0; j <  this.currentBoardSize; j++){
                row.push(null);
            }
            table.push(row);
        }

        var helperTable = [];
        
        for(var i = 0; i < this.currentBoardSize; i++){
            var row = [];
            for(var j = 0; j < this.currentBoardSize; j++){
                row.push((i*10)+j);
            }
            helperTable.push(row);
        }

        var cellsToFill = model.currentBoardSize * model.currentBoardSize;
        
        var chosen = [];
        while(cellsToFill > 0){
            var randomPng;
            do{
                randomPng = Math.floor(Math.random()*32);
            }while(chosen.indexOf(randomPng) >= 0);

            chosen.push(randomPng);

            do{
                var row = Math.floor(Math.random() * (helperTable.length-1));
                var col = Math.floor(Math.random() * (helperTable[row].length-1));
                
            }while(row < 0 || col < 0);
            
            var pos = helperTable[row][col];
            var y = pos%10;
            var x = Math.floor(pos/10);

            helperTable[row].splice(col,1);
            if(helperTable[row].length == 0){
                helperTable.splice(row, 1);
            }

            table[x][y] = randomPng+".png";
            
            var counter = 100;
            do{
                var row = Math.floor(Math.random() * (helperTable.length-1));
                var col = Math.floor(Math.random() * (helperTable[row].length-1));    
            }while(row < 0 || col < 0);
            
            pos = helperTable[row][col];
            y = pos%10;
            x = Math.floor(pos/10);
            
            helperTable[row].splice(col,1);
            if(helperTable[row].length == 0){
                helperTable.splice(row, 1);
            }
            table[x][y] = randomPng+".png";
            
            cellsToFill-= 2;
            
        }
        this.currentTable = table;
    },

}

var controller = {
    startGame : function(){
        view.createOptions();
        
        var resetBtn = document.getElementById("resetBtn");
        resetBtn.onclick = view.backToMenu;
    },
    takeTurn: function(){
        var whoseTurnWasThis = model.currentPlayer;
        model.numberOfCardsFlipped++;
        if(model.numberOfCardsFlipped == 2){
            var card1 =  model.currentCards[0];
            var card2 = model.currentCards[1];

            var card1_x = Number(card1.charAt(0));
            var card1_y = Number(card1.charAt(1));

            var card2_x = Number(card2.charAt(0));
            var card2_y = Number(card2.charAt(1));
            
            
            if(model.currentTable[card1_x][card1_y] === model.currentTable[card2_x][card2_y]){
                if(model.currentPlayer == 1) model.player1Score++;
                else model.player2Score++;

                model.totalCardsFlipped+=2;
            }else{
                setTimeout(()=>{
                    view.closeCard(document.getElementById(card1));
                }, 1000);
                setTimeout(()=>{
                    view.closeCard(document.getElementById(card2));
                }, 1000);
                
                model.currentPlayer = (model.currentPlayer == 1)? 2 : 1;
            }

            model.currentCards = [];
            model.numberOfCardsFlipped = 0;

            if(model.totalCardsFlipped == model.currentBoardSize*model.currentBoardSize){
                this.endGame();
            }
            view.updateScore(whoseTurnWasThis);
        }
    },

    endGame: function(){
        if(model.player1Score > model.player2Score){
            view.showMsg(1);
        }else if(model.player2Score > model.player1Score){
            view.showMsg(2);
        }else{
            view.showMsg(0);
        }
    }
}



window.onload = controller.startGame;
