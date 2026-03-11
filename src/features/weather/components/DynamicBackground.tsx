import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWeatherStore } from '../../../store/weatherStore';

interface Particle {
    x: number;
    y: number;
    speed: number;
    length: number;
    opacity: number;
}

export default function DynamicBackground() {
    const { current } = useWeatherStore();
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas || !current) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrameId: number;
        let particles: Particle[] = [];
        const weatherCode = current.weatherCode;

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            initParticles();
        };

        const initParticles = () => {
            particles = [];
            let count = 0;
            
            // Drizzle/Rain/Storm
            if (weatherCode >= 51 && weatherCode <= 82) {
                count = weatherCode >= 61 ? 150 : 80; // More rain for heavier codes
            } else if (weatherCode >= 85 && weatherCode <= 86) {
                count = 100; // Snow
            }

            for (let i = 0; i < count; i++) {
                particles.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    speed: Math.random() * 15 + 10,
                    length: Math.random() * 20 + 10,
                    opacity: Math.random() * 0.5 + 0.1
                });
            }
        };

        const drawRain = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.strokeStyle = weatherCode >= 61 ? 'rgba(174, 194, 224, 0.5)' : 'rgba(174, 194, 224, 0.3)';
            ctx.lineWidth = 1;

            particles.forEach(p => {
                ctx.beginPath();
                ctx.moveTo(p.x, p.y);
                ctx.lineTo(p.x + (current.windSpeed / 10), p.y + p.length);
                ctx.stroke();

                p.y += p.speed;
                p.x += (current.windSpeed / 10);

                if (p.y > canvas.height) {
                    p.y = -p.length;
                    p.x = Math.random() * canvas.width;
                }
            });

            animationFrameId = requestAnimationFrame(drawRain);
        };

        const drawSnow = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';

            particles.forEach(p => {
                ctx.beginPath();
                ctx.arc(p.x, p.y, Math.random() * 2 + 1, 0, Math.PI * 2);
                ctx.fill();

                p.y += p.speed / 5;
                p.x += Math.sin(p.y / 50) * 2;

                if (p.y > canvas.height) {
                    p.y = -5;
                    p.x = Math.random() * canvas.width;
                }
            });

            animationFrameId = requestAnimationFrame(drawSnow);
        };

        window.addEventListener('resize', resize);
        resize();

        if (weatherCode >= 51 && weatherCode <= 82) {
            drawRain();
        } else if (weatherCode >= 85 && weatherCode <= 86) {
            drawSnow();
        } else {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }

        return () => {
            window.removeEventListener('resize', resize);
            cancelAnimationFrame(animationFrameId);
        };
    }, [current]);

    const isCloudy = current?.weatherCode && current.weatherCode >= 1 && current.weatherCode <= 48;
    const isStorm = current?.weatherCode && [95, 96, 99].includes(current.weatherCode);

    return (
        <div className="fixed inset-0 -z-20 pointer-events-none overflow-hidden bg-flat-bg">
            <AnimatePresence>
                {/* Sunlight for Clear Sky */}
                {current?.weatherCode === 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute top-0 right-0 w-full h-full bg-linear-to-bl from-amber-100/20 to-transparent"
                    />
                )}

                {/* Clouds */}
                {isCloudy && (
                    <>
                        <motion.div
                            initial={{ x: '-100%' }}
                            animate={{ x: '100%' }}
                            transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
                            className="absolute top-[10%] left-0 w-[800px] h-[400px] bg-slate-400/5 blur-[100px] rounded-full"
                        />
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: '-100%' }}
                            transition={{ duration: 80, repeat: Infinity, ease: 'linear' }}
                            className="absolute top-[40%] right-0 w-[600px] h-[300px] bg-slate-500/5 blur-[80px] rounded-full"
                        />
                    </>
                )}

                {/* Storm Flash */}
                {isStorm && (
                    <motion.div
                        animate={{ 
                            opacity: [0, 0, 0.2, 0, 0.5, 0, 0, 0] 
                        }}
                        transition={{ 
                            duration: 4, 
                            repeat: Infinity,
                            times: [0, 0.7, 0.75, 0.8, 0.85, 0.9, 0.95, 1]
                        }}
                        className="absolute inset-0 bg-white"
                    />
                )}
            </AnimatePresence>

            <canvas
                ref={canvasRef}
                className="absolute inset-0 w-full h-full"
            />
            
            {/* Darken background for rain/storm */}
            {current?.weatherCode && current.weatherCode >= 51 && (
                <div className="absolute inset-0 bg-slate-900/5 backdrop-blur-[2px]" />
            )}
        </div>
    );
}
