import { Loader2 } from "lucide-react";

const Loader = () => (
  <div className="flex justify-center items-center py-20">
    <Loader2 className="animate-spin text-orange-600 h-10 w-10" />
  </div>
);
export default Loader;