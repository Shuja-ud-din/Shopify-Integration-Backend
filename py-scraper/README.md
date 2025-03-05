# eBay Scraper Server 🛒

This project is a FastAPI-based web scraper for extracting product details from eBay.

## Features ✨
- Scrapes product details such as title, stock quantity, availability, price, and more.
- Handles retries and rate limiting.
- Uses BeautifulSoup for HTML parsing.

## Requirements 📋
- Python 3.12+
- Virtual environment (recommended)

## Installation 🛠️

1. **Clone the repository**:
    ```sh
    git clone https://github.com/yourusername/ebay-scraper.git
    cd ebay-scraper
    ```

2. **Create a virtual environment**:
    ```sh
    python -m venv venv
    ```

3. **Activate the virtual environment**:
    - On Windows:
        ```sh
        venv\Scripts\activate
        ```
    - On macOS/Linux:
        ```sh
        source venv/bin/activate
        ```

4. **Install dependencies**:
    ```sh
    pip install -r requirements.txt
    ```

## Running the Server 🚀

### Development Mode 🛠️

1. **Run the FastAPI server**:
    ```sh
    uvicorn app:app --reload
    ```

2. **Access the API**:
    Open your browser and navigate to `http://127.0.0.1:8000`.

3. **Interactive API docs**:
    - Swagger UI: `http://127.0.0.1:8000/docs`
    - ReDoc: `http://127.0.0.1:8000/redoc`

### Production Mode 🏭

1. **Run the FastAPI server with Uvicorn**:
    ```sh
    uvicorn app:app --host 0.0.0.0 --port 8000
    ```

2. **Using a process manager (e.g., Gunicorn)**:
    ```sh
    gunicorn -w 4 -k uvicorn.workers.UvicornWorker app:app
    ```

## Usage 📦

1. **Scrape eBay product details**:
    - Send a GET request to the root endpoint `/` with the eBay product URL.
    - Example:
        ```sh
        curl http://127.0.0.1:8000/
        ```

## Contributing 🤝

1. **Fork the repository**.
2. **Create a new branch**:
    ```sh
    git checkout -b feature/your-feature-name
    ```
3. **Commit your changes**:
    ```sh
    git commit -m 'Add some feature'
    ```
4. **Push to the branch**:
    ```sh
    git push origin feature/your-feature-name
    ```
5. **Open a pull request**.

## License 📄

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments 🙏

- [FastAPI](https://fastapi.tiangolo.com/)
- [BeautifulSoup](https://www.crummy.com/software/BeautifulSoup/)

Happy Scraping! 🎉