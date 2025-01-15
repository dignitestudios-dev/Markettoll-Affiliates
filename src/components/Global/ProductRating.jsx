import { IoIosStar } from "react-icons/io";

const ProductRating = ({ productAvgRating }) => {
  const fillPercentage = (productAvgRating / 5) * 100;

  return (
    <div className="flex items-center gap-2 justify-start">
      <div className="relative w-6 h-6">
        <IoIosStar
          className="absolute text-gray-300 w-full h-full"
          style={{
            background: `linear-gradient(90deg, #FBBF24 ${fillPercentage}%, #E5E7EB ${fillPercentage}%)`,
            WebkitBackgroundClip: "text",
            color: "transparent",
          }}
        />
        <IoIosStar className="absolute text-gray-300 w-full h-full" />
      </div>
      <span className="text-base text-[#606060] font-medium">
        {productAvgRating?.toFixed(1)}
      </span>
    </div>
  );
};

export default ProductRating;
