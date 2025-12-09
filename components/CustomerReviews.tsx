import React from 'react';
import { Star, Quote, ThumbsUp } from 'lucide-react';

interface Review {
  id: number;
  author: string;
  location: string;
  rating: number;
  date: string;
  title: string;
  content: string;
  productName?: string;
  verified: boolean;
}

const reviews: Review[] = [
  {
    id: 1,
    author: "Mike S.",
    location: "Kingston, PA",
    rating: 5,
    date: "2 weeks ago",
    title: "Better than the big box stores",
    content: "Bought the DeWalt 20V Drill Kit here. The staff actually knew what they were talking about and helped me pick the right bits for my masonry project. You don't get that kind of service at the chains.",
    productName: "DeWalt 20V Max Cordless Drill Kit",
    verified: true
  },
  {
    id: 2,
    author: "Sarah Jenkins",
    location: "Wilkes-Barre, PA",
    rating: 5,
    date: "1 month ago",
    title: "Christmasland is magical!",
    content: "Every year we get our new additions from here. The 12ft Santa is the talk of the neighborhood! The quality is so much better than what I've bought online. Highly recommend checking out their display.",
    productName: "12ft Inflatable Santa Claus",
    verified: true
  },
  {
    id: 3,
    author: "David R.",
    location: "Mountain Top, PA",
    rating: 5,
    date: "3 days ago",
    title: "Saved my pool this summer",
    content: "I was struggling with algae for weeks. Brought a water sample in, they tested it on the spot, and set me up with the 3-Inch Chlorine Tabs and a shock treatment plan. Pool was clear in 48 hours.",
    productName: "50lb 3-Inch Chlorine Tablets",
    verified: true
  },
  {
    id: 4,
    author: "B2B Construction Co.",
    location: "Commercial Account",
    rating: 5,
    date: "Yesterday",
    title: "Reliable winter supply",
    content: "We stock up on snow pushers and salt here for our facility management contracts. The commercial desk always has our order ready for pickup. Top notch reliability.",
    productName: "Commercial Snow Pusher Shovel",
    verified: true
  }
];

const CustomerReviews: React.FC = () => {
  return (
    <section className="bg-white py-16 md:py-24 border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl serif mb-4">
            What Our Neighbors Are Saying
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            We take pride in serving the Wilkes-Barre community. Here's honest feedback from real local customers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {reviews.map((review) => (
            <div key={review.id} className="bg-slate-50 rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow duration-300 border border-slate-100 relative">
              <Quote size={48} className="absolute top-6 right-6 text-slate-200" />
              
              <div className="flex items-center space-x-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    size={18} 
                    fill={i < review.rating ? "#eab308" : "none"} 
                    className={i < review.rating ? "text-yellow-500" : "text-slate-300"}
                  />
                ))}
              </div>

              <h3 className="text-xl font-bold text-slate-900 mb-2">{review.title}</h3>
              <p className="text-slate-600 italic mb-6 relative z-10">"{review.content}"</p>

              {review.productName && (
                <div className="mb-6 inline-flex items-center px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold border border-blue-100">
                  <ThumbsUp size={12} className="mr-1.5" />
                  Recommends: {review.productName}
                </div>
              )}

              <div className="flex items-center justify-between pt-6 border-t border-slate-200">
                <div>
                  <p className="font-bold text-slate-900">{review.author}</p>
                  <p className="text-sm text-slate-500">{review.location}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-slate-400">{review.date}</p>
                  {review.verified && (
                    <span className="text-xs text-green-600 font-medium flex items-center justify-end mt-1">
                      Verified Purchase
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <a 
            href="https://www.facebook.com/MainHardwarePoolSupply" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center px-6 py-3 border border-slate-300 shadow-sm text-base font-medium rounded-md text-slate-700 bg-white hover:bg-slate-50 transition-colors"
          >
            Read more reviews on Facebook
          </a>
        </div>
      </div>
    </section>
  );
};

export default CustomerReviews;