// ✅ /src/app/order-options/page.tsx
import OrderOptionsContent from '@/components/OrderOptionsContent';

import { Suspense } from 'react';

// ✅ This wraps the actual client content
const LazyOrderOptionsContent = () => {
  return (
    <Suspense fallback={
      <div className="fixed inset-0 bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    }>
      <OrderOptionsContent />
    </Suspense>
  );
};

export default LazyOrderOptionsContent;
