import React, { useState } from "react";

const RecipeItem = ({ recipe }) => {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <li style={{ margin: "10px 0" }}>
      <strong onClick={() => setShowDetails(!showDetails)} style={{ cursor: "pointer" }}>
        {recipe.name}
      </strong>
      {showDetails && (
        <div style={{ marginLeft: "10px" }}>
          <p>ID: {recipe._id}</p>
          {/* rozbudować o jakies składniki, batch, user itd.!!! */}
        </div>
      )}
    </li>
  );
};

export default RecipeItem;
