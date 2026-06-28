  let board = [];
  let solution = [];
  let given = [];
  let selected = null;
  let errors =[];
  let mistakes = 0;
  let maxMistakes = 5;
  let timerInterval = null;
  let seconds = 0;
  let gameOver = false;

  //New Game Start on Play & on NewGame
  function newGame() {
    const pool= [
      ["400000080080070400100800002020005000004002010900040008010006000008900030000010200",
       "435269781682571493197834562826195347374682915951743628519326874248957136763418259"],
      ["100400009050009000700003400030000090004007001800001060010040000005008300000300040",
       "123456789456789123789123456231564897564897231897231564312645978645978312978312645"],
      ["500070010070000300100302000009000400020050090700004006001000200080400030300080009",
       "534678912672195348198342567859761423426853791713924856961537284287419635345286179"],
      ["006009020010050000800000006000500800050090030001004007400070000008000300000305078",
       "546789123213456789879123456324567891657891234981234567435678912768912345192345678"],
      ["060020007007000020000907000700040010050000006009000500000402008300090000008005430",
       "564321987897654321231987654786543219453219876129876543675432198342198765918765432"]
    ]
    const pick = pool[Math.floor(Math.random() * pool.length)];
    board = pick[0].split('').map(Number);
    solution = pick[1].split('').map(Number);
    given = board.map(v => v !== 0);
    selected = null;
    mistakes = 0;
    gameOver = false;
    errors = [];
    setMessage('');
    updateMistakes();
    newBoard();
  }

  function newBoard() {
    const boardEl = document.getElementById('sudoku-board');
    boardEl.innerHTML = '';
    for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++){
      const cell = document.createElement('div');
      cell.classList.add('cell');
      if (i === 2 || i === 5) cell.classList.add('row-bottom');
      if (j === 2 || j === 5) cell.classList.add('col-right');

      let block= (i*9) + j;
      if (board[block] !== 0) cell.textContent = board[block];
      if (block === selected) {
        cell.classList.add('selected');
      }
      if (errors.includes(block)){
          cell.classList.add('error');
      }
      cell.addEventListener('click', () => {
        selected= block;
        errors= errors.filter(ele=> board[ele]!==0)
        newBoard();
      });

      boardEl.appendChild(cell);
    }
    }
  }

  //Input the user interaction
  function inputNum(n) {
    if (board[selected] === n || (given[selected])) return;
    board[selected] = n;
    newBoard();
  }

  document.addEventListener('keydown', function(e){
    if (e.key >= '1' && e.key <= '9') inputNum(parseInt(e.key));
    let col = selected % 9;
    let row = (selected-col) / 9;
    if (e.key === 'ArrowRight' && col < 8) { selected++; newBoard(); }
    if (e.key === 'ArrowLeft'  && col > 0) { selected--; newBoard(); }
    if (e.key === 'ArrowDown'  && row < 8) { selected += 9; newBoard(); }
    if (e.key === 'ArrowUp'    && row > 0) { selected -= 9; newBoard(); }
  });

  function eraseCell() {
    board[selected] = 0;
    errors= errors.filter(ele=> ele!==selected);
    newBoard();
  }

  // check the solution if clicked Check
  function checkWin() {
    if (board.every((v, i) => v === solution[i])) {
      triggerWin();
    }else{
      mistakes++;
      updateMistakes();
      for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++){
          let block= (i*9)+j;
          if (!given[block] && board[block] !== 0 && board[block] !== solution[block]) {
            errors.push(block);
          }
          if(!given[block]){
            errors.push(block);
          }
        }
      } 
      newBoard();
      setMessage('Some cells are wrong.', true);
    }
  }

  function updateMistakes() {
    document.getElementById( 'mistake-total').textContent = `Total Mistakes: ${mistakes}` ; // ${maxMistakes}
  }

  function closeWin() {
    document.getElementById('win-overlay').classList.remove('show');
  }

  function setMessage(msg, isError = false) {
    const el = document.getElementById('message');
    el.textContent = msg;
    el.className = (isError) ? 'error-msg' : '';
  }

  // Starting point of the game
  function play(){
    const st= document.getElementsByClassName('btn-play');
    st[0].style.display= "none";

    const subt= document.getElementsByClassName('subtitle');
    subt[0].innerHTML= `Fill in the grid to check the answer`;

    const wrap1 = document.getElementById('sudoku-board');
    wrap1.style.display= "grid";

    const wrap2 = document.getElementsByClassName('board-wrapper');
    wrap2[0].style.display= "flex";

    const nump= document.getElementById('numpad');
    nump.style.display= "flex";

    const buttons= document.getElementsByClassName('actions');
    buttons[0].style.display= "flex"; 

    const messages= document.getElementById('message');
    messages.style.display= "flex";

    const timers= document.getElementsByClassName('mistakes');
    timers[0].style.display= "flex";
    newGame();  
  }

  function triggerWin(){
    const win_time= document.getElementById('message')
    win_time.textContent = `You Won!!!! Mistakes made: ${mistakes}`;

    const st= document.getElementsByClassName('btn-play');
    st[0].style.display= "flex";

    const subt= document.getElementsByClassName('subtitle');
    subt[0].innerHTML= `Click <b>PLAY</b> to Restart`;

    const wrap1 = document.getElementById('sudoku-board');
    wrap1.style.display= "none";

    const wrap2 = document.getElementsByClassName('board-wrapper');
    wrap2[0].style.display= "none";

    const nump= document.getElementById('numpad');
    nump.style.display= "none";

    const buttons= document.getElementsByClassName('actions');
    buttons[0].style.display= "none"; 

    const timers= document.getElementsByClassName('mistakes');
    timers[0].style.display= "none";
  }