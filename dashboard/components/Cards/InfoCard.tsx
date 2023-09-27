import { ReactSVGElement } from "react";
import { Card, CardBody } from "@roketid/windmill-react-ui";
// import Skeleton from "react-loading-skeleton";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

interface IInfoCard {
  title: string;
  value: string;
  loading: boolean;
  children?: ReactSVGElement;
}

function InfoCard({ title, value, loading, children }: IInfoCard) {
  return (
    <Card className="md:w-80">
      <CardBody className="flex items-center">
        {children}
        <div>
          <p className="mb-2 text-sm font-medium text-gray-600 dark:text-gray-400">
            {title}
          </p>
          <p className="text-lg font-semibold text-gray-700 dark:text-gray-200">
            {loading === true ? <Skeleton /> : value}
          </p>
        </div>
      </CardBody>
    </Card>
  );
}

export default InfoCard;
