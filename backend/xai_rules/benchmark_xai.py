
import time
from statistics import mean

from .gradcam import load_model, generate_gradcam
from .gradcam_service import GradCAMService


def benchmark(image_path, runs=5):

    print("\nLoading original model...")
    original_model = load_model()

    print("\nLoading optimized service...")
    service = GradCAMService()

    original_times = []
    optimized_times = []

    # Warm up both implementations
    print("\nWarming up models...")
    generate_gradcam(original_model, image_path)
    service.generate(image_path)

    print("\nStarting benchmark...")

    for i in range(runs):

        start = time.perf_counter()

        generate_gradcam(
            original_model,
            image_path
        )

        original_times.append(
            time.perf_counter() - start
        )

        start = time.perf_counter()

        service.generate(image_path)

        optimized_times.append(
            time.perf_counter() - start
        )

        print(f"Test {i + 1}/{runs} completed")

    original_avg = mean(original_times)
    optimized_avg = mean(optimized_times)

    improvement = (
        (original_avg - optimized_avg)
        / original_avg
    ) * 100

    speedup = original_avg / optimized_avg

    print("\nAGRISHIELD PERFORMANCE BENCHMARK")
    print("--------------------------------")

    print(f"Total test runs: {runs}")

    print(
        f"Original average: {original_avg:.3f} seconds"
    )

    print(
        f"Optimized average: {optimized_avg:.3f} seconds"
    )

    print(f"Time reduction: {improvement:.2f}%")
    print(f"Speedup: {speedup:.2f}x")

    if improvement > 0:
        print("Optimized service is faster.")
    else:
        print("No measured speed improvement.")


if __name__ == "__main__":

    image_path = input(
        "Enter leaf image path: "
    ).strip().strip('"')

    benchmark(image_path)
