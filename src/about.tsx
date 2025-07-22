export default function About() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-[var(--secondary-soft-warm-beige)]">
            <h1 className="text-4xl font-bold text-[var(--main-blue)] mb-8">About Us</h1>
            <p className="text-lg text-[var(--secondary-gray)] max-w-2xl text-center px-4">
                Welcome to Artful Expressions! We are dedicated to providing a creative and inspiring environment for all art enthusiasts. Our mission is to foster creativity, community, and a love for the arts through our diverse range of classes and services.
            </p>
        </div>
    );
}