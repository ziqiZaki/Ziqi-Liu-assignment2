import { createContext, useState } from "react";

export const GameContext = createContext();

// export const GameProvider = ({ children }) => {
//     const [isHeatMapMode, setIsHeatMapMode] = useState(false);
  
//     return (
//       <GameContext.Provider value={{ isHeatMapMode, setIsHeatMapMode }}>
//         {children}
//       </GameContext.Provider>
//     );
//   };