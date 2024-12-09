import { IoIosStar, IoIosStarOutline, IoIosStarHalf } from "react-icons/io";

const ProductRating = ({ productAvgRating }) => {
  const fullStars = Math.floor(productAvgRating);
  const halfStars = productAvgRating % 1 >= 0.5 ? 1 : 0;
  const emptyStars = 5 - fullStars - halfStars;

  const renderStars = () => {
    const stars = [];

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <IoIosStar key={`full-${i}`} className="text-yellow-400 text-lg" />
      );
    }

    for (let i = 0; i < halfStars; i++) {
      stars.push(
        <IoIosStarHalf key={`half-${i}`} className="text-yellow-400 text-lg" />
      );
    }

    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <IoIosStarOutline
          key={`empty-${i}`}
          className="text-yellow-400 text-lg"
        />
      );
    }

    return stars;
  };

  return (
    <div className="flex items-center gap-1 w-full">
      {renderStars()}
      <span className="text-base text-[#606060] font-medium">
        {productAvgRating?.toFixed(1)}{" "}
      </span>
    </div>
  );
};

export default ProductRating;
