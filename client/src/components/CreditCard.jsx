import CreditCardIcon from "@/components/CreditCardIcon";
import { Card } from "@/components/ui/card";

export default function CreditCard({
  bgColor,
  textColor,
  title,
  description,
  benefits,
  iconColor,
}) {
  return (
    <Card
      className={`${bgColor} ${textColor} p-6 rounded-lg shadow-lg`}
      style={{ width: "320px", height: "400px" }}
    >
      <div className="flex flex-col justify-between h-full">
        <div className="flex items-center gap-4">
          <div className="bg-white rounded-full p-3">
            <CreditCardIcon className={`w-8 h-8 ${iconColor}`} />
          </div>
          <div>
            <h3 className="text-xl font-semibold">{title}</h3>
            <p className="text-sm mt-2">{description}</p>
          </div>
        </div>
        <ul className="mt-4 list-disc list-inside">
          {benefits.map((benefit, index) => (
            <li key={index}>{benefit}</li>
          ))}
        </ul>
      </div>
    </Card>
  );
}
