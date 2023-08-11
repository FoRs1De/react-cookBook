import { useParams } from 'react-router-dom';
import "./Recipe.css"

const Recipe = ({ recipe, loading }) => {
  const { recipeId } = useParams();

  let filteredItem = recipe.filter((item) => {
    return item.id == recipeId;
  });
  console.log(filteredItem);
  console.log(recipe);
  return (
    <div>
      {loading ? (
        <p>Loading...</p>
      ) : recipe?.length > 0 && filteredItem ? (
        <>
          <h1 className='Title-Recipe'>{filteredItem[0].name}</h1>
          <img
            className="pic"
            src={filteredItem[0].img}
            alt={filteredItem[0].name}
          />
          <h3 className='Description'>{filteredItem[0].description}</h3>
          {filteredItem[0].ingredients.map((item, index) => (
            <p className="ingredients-table"key={index}>{item}</p>
          ))}
        </>
      ) : (
        <p>No recipe found.</p>
      )}
    </div>
  );
};

export default Recipe;
