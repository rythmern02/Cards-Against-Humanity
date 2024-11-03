"use client";
import Image from "next/image";
import { Roboto_Slab, Roboto_Mono } from "next/font/google";
import { motion } from "framer-motion";
import Link from "next/link";
const robotoSlab = Roboto_Slab({ subsets: ["latin"] });
const robotoMono = Roboto_Mono({ subsets: ["latin"] });

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-900 text-white overflow-x-hidden">
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="relative z-10 text-center">
          <h1
            className={`${robotoSlab.className} text-6xl md:text-8xl font-bold mb-4 animate-pulse`}
          >
            Cards Against Humanity
          </h1>
          <p
            className={`${robotoMono.className} text-2xl md:text-4xl mb-8 animate-bounce`}
          >
            Now on Solana Blinks!
          </p>
          <Link
            href={
              "https://dial.to/?action=solana-action%3Ahttps%3A%2F%2Fwww.cardsagainsthumanity.fun%2Fapi%2Factions%2Fgame&cluster=devnet"
            }
          >
            <button className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-full text-xl transition-all duration-300 transform hover:scale-110">
              Get Started
            </button>
          </Link>
        </div>
        <div className="absolute inset-0 z-0">
          {/* <Image
            src="/placeholder.svg?height=1080&width=1920"
            alt="Cards scattered"
            layout="fill"
            objectFit="cover"
            className="animate-pulse"
          /> */}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 md:px-0">
        <div className="container mx-auto">
          <h2
            className={`${robotoSlab.className} text-4xl md:text-5xl font-bold mb-12 text-center`}
          >
            Play Anytime, Anywhere!
          </h2>
          <div className="flex justify-center space-x-8">
            {["X", "DSCVR", "Dialet Explorer", "Social Explorer"].map(
              (platform, index) => (
                <motion.div
                  key={platform}
                  className="bg-gray-700 p-6 rounded-lg shadow-lg"
                  whileHover={{ scale: 1.05, rotate: 5 }}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <h3 className="text-2xl font-semibold">{platform}</h3>
                </motion.div>
              )
            )}
          </div>
        </div>
      </section>

      {/* Blink Lifecycle Section */}
      <section className="py-20 bg-gray-800">
        <div className="container mx-auto px-4 md:px-0">
          <h2
            className={`${robotoSlab.className} text-4xl md:text-5xl font-bold mb-12 text-center`}
          >
            The Blink Lifecycle
          </h2>
          <div className="flex flex-col md:flex-row items-center justify-center space-y-8 md:space-y-0 md:space-x-8">
            {[
              "Choose Task",
              "Provide Proof",
              "Mint NFT",
              "Rate Experience",
            ].map((step, index) => (
              <div
                key={step}
                className={`bg-gray-700 p-6 rounded-lg shadow-lg w-full md:w-1/4 transform hover:scale-105 transition-all duration-300 ${
                  index % 2 === 0
                    ? "animate-float-slow"
                    : "animate-float-slower"
                }`}
              >
                <h2
                  className={`${robotoMono.className} text-2xl font-bold mb-4`}
                >
                  {step}
                </h2>
                <p className="text-gray-300 mb-4">
                  Step {index + 1}: {step}
                </p>
                <div className="h-40 relative overflow-hidden rounded-md">
                  <Image
                    src={`/step${index + 1}.png`}
                    alt={`${step} illustration`}
                    layout="fill"
                    objectFit="contain"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Hilarious Task Examples Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 md:px-0">
          <h2
            className={`${robotoSlab.className} text-4xl md:text-5xl font-bold mb-12 text-center`}
          >
            Hilarious Task Examples
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              "I drink to forget _____.",
              "What's that smell?",
              "I got 99 problems but _____ ain't one.",
              "______ + ______ = ______.",
            ].map((task, index) => (
              <div
                key={task}
                className={`bg-gray-800 p-6 rounded-lg shadow-lg transform hover:scale-105 transition-all duration-300 ${
                  index % 2 === 0 ? "animate-wiggle" : "animate-wiggle-slow"
                }`}
              >
                <h3
                  className={`${robotoMono.className} text-2xl font-bold mb-4`}
                >
                  Task {index + 1}
                </h3>
                <p className="text-gray-300 text-xl mb-4">{task}</p>
                <button className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-full transition-all duration-300 transform hover:scale-110">
                  Fill in the blank!
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-800">
        <div className="container mx-auto px-4 md:px-0 text-center">
          <h2
            className={`${robotoSlab.className} text-4xl md:text-5xl font-bold mb-8`}
          >
            Ready to Get Inappropriate?
          </h2>
          <p className={`${robotoMono.className} text-xl md:text-2xl mb-12`}>
            Join the most hilarious game on Solana Blinks!
          </p>
          <Link
            href={
              "https://dial.to/?action=solana-action%3Ahttps%3A%2F%2Fwww.cardsagainsthumanity.fun%2Fapi%2Factions%2Fgame&cluster=devnet"
            }
          >
            <button className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-full text-xl transition-all duration-300 transform hover:scale-110 animate-pulse">
              Start Playing Now!
            </button>
          </Link>
        </div>
      </section>
    </main>
  );
}
