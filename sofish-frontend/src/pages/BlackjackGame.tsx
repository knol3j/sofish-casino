import { useState } from 'react'
import { useUserBalance } from '../hooks/useGames'

type Card = {
  suit: '♠️' | '♥️' | '♦️' | '♣️'
  value: string
  numericValue: number
}

type GameState = 'betting' | 'playing' | 'finished'

export function BlackjackGame() {
  const [betAmount, setBetAmount] = useState(10)
  const [gameState, setGameState] = useState<GameState>('betting')
  const [deck, setDeck] = useState<Card[]>([])
  const [playerHand, setPlayerHand] = useState<Card[]>([])
  const [dealerHand, setDealerHand] = useState<Card[]>([])
  const [result, setResult] = useState<string>('')
  const [winAmount, setWinAmount] = useState(0)
  const { data: balanceData, refetch: refetchBalance } = useUserBalance()

  const createDeck = (): Card[] => {
    const suits: Card['suit'][] = ['♠️', '♥️', '♦️', '♣️']
    const values = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K']
    const deck: Card[] = []

    for (const suit of suits) {
      for (const value of values) {
        let numericValue = parseInt(value)
        if (value === 'A') numericValue = 11
        else if (['J', 'Q', 'K'].includes(value)) numericValue = 10

        deck.push({ suit, value, numericValue })
      }
    }

    // Shuffle deck
    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]]
    }

    return deck
  }

  const calculateHandValue = (hand: Card[]): number => {
    let value = hand.reduce((sum, card) => sum + card.numericValue, 0)
    let aces = hand.filter(card => card.value === 'A').length

    // Adjust for aces
    while (value > 21 && aces > 0) {
      value -= 10
      aces--
    }

    return value
  }

  const startGame = () => {
    if (!balanceData || balanceData.balance < betAmount) return

    const newDeck = createDeck()
    const playerCards = [newDeck.pop()!, newDeck.pop()!]
    const dealerCards = [newDeck.pop()!, newDeck.pop()!]

    setDeck(newDeck)
    setPlayerHand(playerCards)
    setDealerHand(dealerCards)
    setGameState('playing')
    setResult('')
    setWinAmount(0)

    // Check for blackjack
    if (calculateHandValue(playerCards) === 21) {
      finishGame(playerCards, dealerCards, newDeck, true)
    }
  }

  const hit = () => {
    const newDeck = [...deck]
    const newPlayerHand = [...playerHand, newDeck.pop()!]
    setDeck(newDeck)
    setPlayerHand(newPlayerHand)

    const playerValue = calculateHandValue(newPlayerHand)
    if (playerValue > 21) {
      finishGame(newPlayerHand, dealerHand, newDeck)
    } else if (playerValue === 21) {
      stand(newPlayerHand, newDeck)
    }
  }

  const stand = (currentPlayerHand = playerHand, currentDeck = deck) => {
    let newDealerHand = [...dealerHand]
    let workingDeck = [...currentDeck]

    // Dealer must hit until 17 or higher
    while (calculateHandValue(newDealerHand) < 17) {
      newDealerHand.push(workingDeck.pop()!)
    }

    setDealerHand(newDealerHand)
    setDeck(workingDeck)
    finishGame(currentPlayerHand, newDealerHand, workingDeck)
  }

  const finishGame = (finalPlayerHand: Card[], finalDealerHand: Card[], _finalDeck: Card[], isBlackjack = false) => {
    const playerValue = calculateHandValue(finalPlayerHand)
    const dealerValue = calculateHandValue(finalDealerHand)

    let resultText = ''
    let winnings = 0

    if (playerValue > 21) {
      resultText = '💥 BUST! You lose!'
      winnings = 0
    } else if (dealerValue > 21) {
      resultText = '🎉 Dealer BUST! You win!'
      winnings = betAmount * 2
    } else if (isBlackjack && playerValue === 21 && finalPlayerHand.length === 2) {
      resultText = '🌟 BLACKJACK! You win 3:2!'
      winnings = betAmount * 2.5
    } else if (playerValue > dealerValue) {
      resultText = '🎊 You win!'
      winnings = betAmount * 2
    } else if (playerValue === dealerValue) {
      resultText = '🤝 Push! Bet returned.'
      winnings = betAmount
    } else {
      resultText = '😔 Dealer wins!'
      winnings = 0
    }

    setResult(resultText)
    setWinAmount(winnings)
    setGameState('finished')
    refetchBalance()
  }

  const newGame = () => {
    setGameState('betting')
    setPlayerHand([])
    setDealerHand([])
    setResult('')
  }

  return (
    <div className="blackjack-game-page">
      <div className="container">
        <div className="game-header text-center">
          <h1 className="game-title gold-text neon">🃏 BLACKJACK 21 🃏</h1>
          <div className="balance-display">
            <div className="balance-label">YOUR BALANCE</div>
            <div className="balance-amount gold-text">
              {balanceData?.balance?.toLocaleString() || 0} 💰
            </div>
          </div>
        </div>

        <div className="blackjack-container">
          {gameState === 'betting' && (
            <div className="betting-screen card">
              <h2 className="gold-text">PLACE YOUR BET</h2>

              <div className="bet-control">
                <label className="control-label">BET AMOUNT</label>
                <div className="bet-input-group">
                  <button
                    className="btn btn-secondary"
                    onClick={() => setBetAmount(Math.max(10, betAmount - 10))}
                  >
                    -10
                  </button>
                  <input
                    type="number"
                    className="input bet-input"
                    value={betAmount}
                    onChange={(e) => setBetAmount(Number(e.target.value))}
                    min="10"
                    max="1000"
                  />
                  <button
                    className="btn btn-secondary"
                    onClick={() => setBetAmount(Math.min(1000, betAmount + 10))}
                  >
                    +10
                  </button>
                </div>
              </div>

              <div className="quick-bets">
                {[10, 50, 100, 500].map(amount => (
                  <button
                    key={amount}
                    className={`chip ${betAmount === amount ? 'active' : ''}`}
                    onClick={() => setBetAmount(amount)}
                  >
                    {amount}
                  </button>
                ))}
              </div>

              <button
                className="btn btn-primary btn-large"
                onClick={startGame}
                disabled={!balanceData || balanceData.balance < betAmount}
              >
                🎲 DEAL CARDS 🎲
              </button>

              <div className="game-rules">
                <h3>📜 RULES</h3>
                <ul>
                  <li>Get closer to 21 than the dealer without going over</li>
                  <li>Blackjack (21 with 2 cards) pays 3:2</li>
                  <li>Dealer must hit on 16 and stand on 17</li>
                  <li>Aces count as 1 or 11</li>
                  <li>Face cards (J, Q, K) count as 10</li>
                </ul>
              </div>
            </div>
          )}

          {(gameState === 'playing' || gameState === 'finished') && (
            <div className="game-table">
              {/* Dealer's Hand */}
              <div className="hand-section dealer">
                <h3>Dealer's Hand</h3>
                <div className="hand">
                  {dealerHand.map((card, index) => (
                    <div
                      key={index}
                      className={`card ${gameState === 'playing' && index === 1 ? 'hidden' : ''} ${gameState === 'finished' && index === 1 ? 'flip' : ''}`}
                      style={{ animationDelay: `${index * 0.15}s` }}
                    >
                      {gameState === 'playing' && index === 1 ? (
                        <div className="card-back">🎴</div>
                      ) : (
                        <>
                          <div className="card-value">{card.value}</div>
                          <div className={`card-suit ${['♥️', '♦️'].includes(card.suit) ? 'red' : 'black'}`}>
                            {card.suit}
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>
                <div className="hand-value">
                  {gameState === 'finished' ? (
                    <span>Value: <span className="gold-text">{calculateHandValue(dealerHand)}</span></span>
                  ) : (
                    <span>Value: <span className="gold-text">{dealerHand[0]?.numericValue || 0}</span></span>
                  )}
                </div>
              </div>

              {/* Player's Hand */}
              <div className="hand-section player">
                <h3>Your Hand</h3>
                <div className="hand">
                  {playerHand.map((card, index) => (
                    <div key={index} className="card" style={{ animationDelay: `${index * 0.15}s` }}>
                      <div className="card-value">{card.value}</div>
                      <div className={`card-suit ${['♥️', '♦️'].includes(card.suit) ? 'red' : 'black'}`}>
                        {card.suit}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="hand-value">
                  Value: <span className="gold-text">{calculateHandValue(playerHand)}</span>
                </div>
              </div>

              {/* Game Controls */}
              {gameState === 'playing' && (
                <div className="game-actions">
                  <button
                    className="btn btn-primary"
                    onClick={hit}
                    disabled={calculateHandValue(playerHand) >= 21}
                  >
                    👆 HIT
                  </button>
                  <button
                    className="btn btn-secondary"
                    onClick={() => stand()}
                  >
                    ✋ STAND
                  </button>
                </div>
              )}

              {/* Result Display */}
              {gameState === 'finished' && (
                <div className="result-display card">
                  <h2 className={winAmount > betAmount ? 'gold-text' : ''}>{result}</h2>
                  <div className="result-details">
                    <div className="result-row">
                      <span>Bet:</span>
                      <span>{betAmount} tokens</span>
                    </div>
                    <div className="result-row">
                      <span>Win:</span>
                      <span className="gold-text">{winAmount} tokens</span>
                    </div>
                    <div className="result-row total">
                      <span>Net:</span>
                      <span className={winAmount > betAmount ? 'green-text' : 'red-text'}>
                        {winAmount > betAmount ? '+' : ''}{winAmount - betAmount} tokens
                      </span>
                    </div>
                  </div>
                  <button className="btn btn-primary btn-large" onClick={newGame}>
                    🎲 NEW GAME 🎲
                  </button>
                </div>
              )}

              <div className="bet-info">
                <span>Current Bet: <span className="gold-text">{betAmount}</span></span>
              </div>
            </div>
          )}
        </div>
      </div>

      <style>{`
        .blackjack-game-page {
          min-height: 100vh;
          padding: 40px 0 60px;
        }

        .game-header {
          margin-bottom: 40px;
        }

        .game-title {
          font-size: 56px;
          font-weight: 900;
          margin-bottom: 30px;
          font-family: 'Cinzel', serif;
        }

        .balance-display {
          background: rgba(30, 41, 59, 0.8);
          backdrop-filter: blur(10px);
          padding: 20px 40px;
          border-radius: 15px;
          display: inline-block;
          border: 2px solid rgba(255, 215, 0, 0.3);
        }

        .balance-label {
          font-size: 14px;
          color: rgba(255, 255, 255, 0.7);
          letter-spacing: 2px;
          margin-bottom: 8px;
        }

        .balance-amount {
          font-size: 36px;
          font-weight: 900;
          font-family: 'Cinzel', serif;
        }

        .blackjack-container {
          max-width: 1000px;
          margin: 0 auto;
        }

        .betting-screen {
          max-width: 600px;
          margin: 0 auto;
          text-align: center;
        }

        .betting-screen h2 {
          font-size: 32px;
          margin-bottom: 30px;
          font-family: 'Cinzel', serif;
        }

        .bet-control {
          margin-bottom: 30px;
        }

        .control-label {
          display: block;
          font-size: 14px;
          font-weight: 700;
          letter-spacing: 2px;
          margin-bottom: 15px;
          color: var(--gold);
        }

        .bet-input-group {
          display: flex;
          gap: 15px;
          justify-content: center;
          align-items: center;
        }

        .bet-input {
          width: 150px;
          text-align: center;
          font-size: 24px;
          font-weight: 700;
        }

        .quick-bets {
          display: flex;
          gap: 15px;
          justify-content: center;
          margin-bottom: 30px;
        }

        .chip {
          width: 70px;
          height: 70px;
          border-radius: 50%;
          border: 3px solid var(--gold);
          background: rgba(30, 41, 59, 0.8);
          font-size: 18px;
          font-weight: 900;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .chip.active {
          background: var(--gold);
          color: black;
          transform: scale(1.1);
        }

        .btn-large {
          width: 100%;
          padding: 25px;
          font-size: 28px;
          font-weight: 900;
          margin: 20px 0;
        }

        .game-rules {
          margin-top: 40px;
          text-align: left;
        }

        .game-rules h3 {
          color: var(--gold);
          margin-bottom: 15px;
        }

        .game-rules ul {
          list-style: none;
          padding: 0;
        }

        .game-rules li {
          padding: 10px 0;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .game-table {
          background: linear-gradient(135deg, #0f4c3a 0%, #1a5c4a 100%);
          border-radius: 30px;
          padding: 40px;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
          border: 3px solid var(--gold);
        }

        .hand-section {
          margin-bottom: 40px;
        }

        .hand-section h3 {
          color: var(--gold);
          font-size: 24px;
          margin-bottom: 20px;
          font-family: 'Cinzel', serif;
        }

        .hand {
          display: flex;
          gap: 15px;
          justify-content: center;
          margin-bottom: 20px;
          flex-wrap: wrap;
        }

        .card {
          width: 100px;
          height: 140px;
          background: white;
          border-radius: 10px;
          padding: 15px;
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
          position: relative;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          animation: deal 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
          transform-style: preserve-3d;
          transition: transform 0.6s;
        }

        .card.flip {
          animation: flipCard 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        @keyframes deal {
          0% {
            transform: translateX(-200px) translateY(-150px) rotate(-15deg) scale(0.3);
            opacity: 0;
          }
          50% {
            transform: translateX(-100px) translateY(-50px) rotate(-5deg) scale(0.7);
            opacity: 0.5;
          }
          100% {
            transform: translateX(0) translateY(0) rotate(0deg) scale(1);
            opacity: 1;
          }
        }

        @keyframes flipCard {
          0% {
            transform: rotateY(0deg);
          }
          50% {
            transform: rotateY(90deg) scale(1.1);
          }
          100% {
            transform: rotateY(180deg) rotateY(-180deg) scale(1);
          }
        }

        .card-back {
          display: flex;
          align-items: center;
          justify-content: center;
          height: 100%;
          font-size: 48px;
          color: var(--gold);
        }

        .card-value {
          font-size: 28px;
          font-weight: 900;
          color: black;
        }

        .card-suit {
          font-size: 48px;
          text-align: center;
        }

        .card-suit.red {
          color: #ef4444;
        }

        .card-suit.black {
          color: #1f2937;
        }

        .hand-value {
          text-align: center;
          font-size: 20px;
          font-weight: 700;
          color: white;
        }

        .game-actions {
          display: flex;
          gap: 20px;
          justify-content: center;
          margin: 30px 0;
        }

        .game-actions .btn {
          padding: 20px 40px;
          font-size: 24px;
          font-weight: 900;
        }

        .result-display {
          max-width: 500px;
          margin: 30px auto;
          text-align: center;
          background: rgba(0, 0, 0, 0.8);
          border: 2px solid var(--gold);
        }

        .result-display h2 {
          font-size: 36px;
          font-weight: 900;
          margin-bottom: 20px;
          font-family: 'Cinzel', serif;
        }

        .result-details {
          margin: 20px 0;
        }

        .result-row {
          display: flex;
          justify-content: space-between;
          padding: 15px 0;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          font-size: 18px;
        }

        .result-row.total {
          font-size: 24px;
          font-weight: 900;
          border-top: 2px solid var(--gold);
          border-bottom: 2px solid var(--gold);
          margin-top: 10px;
        }

        .bet-info {
          text-align: center;
          font-size: 20px;
          font-weight: 700;
          margin-top: 20px;
        }

        .green-text {
          color: var(--green);
        }

        .red-text {
          color: var(--red);
        }

        @media (max-width: 768px) {
          .game-title {
            font-size: 36px;
          }

          .hand {
            gap: 10px;
          }

          .card {
            width: 70px;
            height: 100px;
            padding: 10px;
          }

          .card-value {
            font-size: 20px;
          }

          .card-suit {
            font-size: 32px;
          }

          .game-actions {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  )
}
